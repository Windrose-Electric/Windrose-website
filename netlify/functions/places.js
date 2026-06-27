// Google Places proxy — returns photos, ratings, reviews, and amenities for charging stations
// Env var required: GOOGLE_PLACES_API_KEY
// Supports two modes:
//   GET ?lat=X&lng=Y&name=Z  →  station metadata JSON
//   GET ?photo=PHOTO_NAME    →  proxied image bytes (API key never exposed to client)

exports.handler = async function(event) {
  const headers = cors();
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not configured' }) };
  }

  const p = event.queryStringParameters || {};

  // ── Photo proxy mode ──────────────────────────────────────────────────────
  if (p.photo) {
    try {
      const url = `https://places.googleapis.com/v1/${p.photo}/media?maxWidthPx=600&skipHttpRedirect=true&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'photo not found' }) };
      }
      const data = await res.json();
      const photoUri = data.photoUri;
      if (!photoUri) return { statusCode: 404, headers, body: JSON.stringify({ error: 'no photoUri' }) };

      // Fetch the actual image from the CDN URI (no key in this URL)
      const imgRes = await fetch(photoUri);
      if (!imgRes.ok) return { statusCode: imgRes.status, headers, body: JSON.stringify({ error: 'image fetch failed' }) };
      const buf = await imgRes.arrayBuffer();
      const ct = imgRes.headers.get('content-type') || 'image/jpeg';
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' },
        body: Buffer.from(buf).toString('base64'),
        isBase64Encoded: true,
      };
    } catch (err) {
      console.error('[places photo]', err.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  // ── Station metadata mode ─────────────────────────────────────────────────
  const { lat, lng, name } = p;
  if (!lat || !lng) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing lat/lng' }) };
  }

  const FIELD_MASK = 'places.id,places.displayName,places.userRatingCount,places.rating,places.reviews,places.photos,places.amenities';

  try {
    // Step 1: Nearby search for EV charging station
    let place = null;

    const nearbyRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: { center: { latitude: +lat, longitude: +lng }, radius: 800 },
        },
        includedTypes: ['electric_vehicle_charging_station'],
        maxResultCount: 1,
        rankPreference: 'DISTANCE',
      }),
    });

    if (nearbyRes.ok) {
      const nd = await nearbyRes.json();
      place = nd.places && nd.places[0];
    }

    // Step 2: Fallback — text search with name + coordinates
    if (!place && name) {
      const textRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        body: JSON.stringify({
          textQuery: name + ' charging station',
          locationBias: {
            circle: { center: { latitude: +lat, longitude: +lng }, radius: 3000 },
          },
          maxResultCount: 1,
        }),
      });
      if (textRes.ok) {
        const td = await textRes.json();
        place = td.places && td.places[0];
      }
    }

    if (!place) {
      return { statusCode: 200, headers, body: JSON.stringify({ found: false }) };
    }

    // Step 3: Extract photo reference (name field, safe to return — photo bytes are proxied)
    const photoRef = place.photos && place.photos.length > 0 ? place.photos[0].name : null;

    // Step 4: Last review date — find most recent publishTime across returned reviews
    let lastReviewDate = null;
    if (place.reviews && place.reviews.length > 0) {
      const times = place.reviews
        .map(function(r) { return r.publishTime; })
        .filter(Boolean)
        .sort()
        .reverse();
      if (times.length) lastReviewDate = times[0];
    }

    // Step 5: Shower — check amenities field, then scan review text
    let hasShower = null;
    if (place.amenities) {
      if (typeof place.amenities.hasShower !== 'undefined') {
        hasShower = place.amenities.hasShower;
      }
    }
    if (hasShower === null && place.reviews) {
      const mentionsShower = place.reviews.some(function(r) {
        return r.text && r.text.text && r.text.text.toLowerCase().indexOf('shower') !== -1;
      });
      if (mentionsShower) hasShower = true;
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Cache-Control': 'public, max-age=3600' },
      body: JSON.stringify({
        found: true,
        placeId: place.id,
        displayName: place.displayName && place.displayName.text,
        rating: place.rating || null,
        reviewCount: place.userRatingCount || 0,
        lastReviewDate,
        hasShower,
        photoRef,
      }),
    };
  } catch (err) {
    console.error('[places]', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}
