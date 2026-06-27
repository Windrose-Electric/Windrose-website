/* windrose-globe.js
   Unified D3 orthographic globe used across how-to-use, how-to-service, and how-to-build pages.
   Layers: mcs · ccs · service · parts · shipping (supply chain)
   Usage:
     WindroseGlobe.init('container-div-id', {
       layers:        ['mcs','ccs','service','parts','shipping'],  // tabs to show
       defaultLayers: ['mcs','ccs'],                               // active on load
       onReady: function(api) {                                    // optional callback
         // api.drawCircle(lat, lng, radiusKm, color)
         // api.clearCircle()
         // api.rotateTo(lat, lng, durationMs)
       }
     });
*/
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
     DATA
  ═══════════════════════════════════════════════════════════════════════════ */

  var CHARGING = [
    {lat:53.6,lng:0.2,name:'Immingham',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Rosper Rd DN40 · Open 24h'},
    {lat:58.4408,lng:14.187,name:'Ödeshög',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Lievägen 9, Ödeshög · Open 24h'},
    {lat:57.2653,lng:11.938,name:'Varberg',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Pollengatan 10 · Open 24h'},
    {lat:56.1429,lng:12.5343,name:'Åstorp',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Bronsgatan 12 · 5★'},
    {lat:52.502,lng:6.2213,name:'Waddinxveen',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · Overslagweg 1 · Open 24h'},
    {lat:51.4082,lng:6.1435,name:'Venlo',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · James Cookweg 31 · 4.5★'},
    {lat:51.3102,lng:4.5426,name:'Antwerp Goordijk',op:'Milence',kw:400,units:5,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Noorderlaan 626 · Open 24h'},
    {lat:51.1224,lng:3.9657,name:'Ghent',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · Yvonne Fontainestraat · 5★'},
    {lat:50.9918,lng:5.7741,name:'Maasmechelen',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Truck Charging Station · Open 24h'},
    {lat:51.8449,lng:12.0028,name:'Vockerode',op:'Milence',kw:300,units:2,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 4.3★'},
    {lat:53.5347,lng:9.7407,name:'Hamburg Port',op:'Milence',kw:1200,units:6,con:'MCS',color:'#60a5fa',note:'Milence · Port of Hamburg · Open 24h'},
    {lat:51.6,lng:7.2,name:'Recklinghausen',op:'Milence',kw:400,units:3,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Open 24h'},
    {lat:51.298,lng:9.3583,name:'Kassel–Lohfelden',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · Open 24h'},
    {lat:50.9429,lng:11.6593,name:'Hermsdorfer Kreuz',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 4.9★'},
    {lat:50.5673,lng:7.6991,name:'Mogendorf',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 4.6★'},
    {lat:50.4367,lng:7.4657,name:'Koblenz',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 5★'},
    {lat:50.1592,lng:11.3222,name:'Himmelkron',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · 4.5★'},
    {lat:49.3633,lng:9.7667,name:'Kirchberg a.d. Jagst',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 5★'},
    {lat:48.498,lng:11.3222,name:'Munich Allianz Arena',op:'Milence',kw:400,units:2,con:'CCS',color:'#60a5fa',note:'Milence · Open 24h'},
    {lat:51.0367,lng:2.5917,name:'Dunkirk',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · Open 24h'},
    {lat:50.649,lng:3.3241,name:'Lille Lesquin',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 5★'},
    {lat:49.4204,lng:4.2574,name:'Reims',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · Open 24h'},
    {lat:49.3796,lng:1.5741,name:'Heudebouville',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Open 24h'},
    {lat:49.351,lng:0.1287,name:'Mondeville',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · 5★'},
    {lat:49.2857,lng:2.8185,name:'Saint-Witz',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Truck Charging Station · Open 24h'},
    {lat:48.9265,lng:6.0657,name:'Gondreville',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 5★'},
    {lat:45.298,lng:4.8926,name:'Malataverne',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · 5★'},
    {lat:44.3347,lng:3.4472,name:'Béziers',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence · 5★'},
    {lat:43.8408,lng:3.1102,name:'Perpignan',op:'Milence',kw:400,units:3,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · 5★'},
    {lat:45.7796,lng:9.5593,name:'Piacenza',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Truck Charging Station · 5★'},
    {lat:45.8122,lng:10.6093,name:'Bagnolo San Vito',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Open 24h'},
    {lat:43.0082,lng:-0.5194,name:'Zaragoza',op:'Milence',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Milence Charging Hub · Open 24h'},
    {lat:57.8286,lng:11.9639,name:'Landvetter',op:'Milence',kw:400,units:6,con:'CCS + MCS',color:'#34d399',note:'Milence · includes 1×1,400 kW MCS · Open 24h'},
    {lat:52.502,lng:6.2213,name:'Zwolle',op:'Milence',kw:400,units:4,con:'CCS + MCS',color:'#34d399',note:'Milence Charging Hub · 5★ · includes 1×1,400 kW MCS'},
    {lat:51.2898,lng:4.4454,name:'Antwerp Ketenis',op:'Milence',kw:400,units:10,con:'CCS + MCS',color:'#34d399',note:'Milence Charging Hub · 4.8★ · largest site (22 bays) · 2×1,400 kW MCS'},
    {lat:60.0327,lng:10.4926,name:'Vestby E18',op:'Circle K',kw:1000,units:2,con:'MCS + CCS2',color:'#34d399',note:'Circle K Charge · Open 24h'},
    {lat:57.9388,lng:13.6944,name:'Jönköping E4',op:'Recharge',kw:1000,units:2,con:'MCS + CCS2',color:'#34d399',note:'Recharge at Hagaleden · Open 24h'},
    {lat:56.1837,lng:10.0,name:'Aarhus E45',op:'Circle K',kw:1000,units:2,con:'MCS + CCS2',color:'#34d399',note:'Circle K Aarhus · Open 24h'},
    {lat:51.9143,lng:4.6269,name:'Rotterdam',op:'Shell Recharge',kw:1000,units:4,con:'MCS + CCS2',color:'#34d399',note:'Shell Recharge · Open 24h'},
    {lat:51.502,lng:0.7185,name:'Thurrock M25',op:'BP Pulse',kw:1000,units:2,con:'MCS',color:'#34d399',note:'bp pulse · Open 24h'},
    {lat:48.9878,lng:2.6306,name:'Paris Rungis',op:'TotalEnergies',kw:1000,units:4,con:'MCS + CCS2',color:'#34d399',note:'TotalEnergies · Open 24h'},
    {lat:46.3429,lng:4.9444,name:'Lyon A7',op:'TotalEnergies',kw:1000,units:2,con:'MCS',color:'#34d399',note:'TotalEnergies A7 · Open 24h'},
    {lat:34.074,lng:-117.323,name:'Colton CA',op:'Greenlane',kw:400,units:8,con:'CCS',color:'#60a5fa',note:'Greenlane Center™ · I-10/I-215 Corridor · Open 24/7'},
    {lat:33.608,lng:-114.596,name:'Blythe CA',op:'Greenlane',kw:400,units:4,con:'CCS',color:'#60a5fa',note:'Greenlane · I-10 Corridor · Open 24/7'},
    {lat:35.264,lng:-116.071,name:'Baker CA',op:'Greenlane',kw:400,units:6,con:'CCS',color:'#60a5fa',note:'Greenlane Plus™ · I-15 Corridor · Coming Soon'},
    {lat:33.830,lng:-116.545,name:'Palm Springs CA',op:'Greenlane',kw:400,units:6,con:'CCS',color:'#60a5fa',note:'Greenlane Center™ · I-10 Corridor · Coming Soon'},
    {lat:36.175,lng:-115.137,name:'Las Vegas NV',op:'Greenlane',kw:400,units:6,con:'CCS',color:'#60a5fa',note:'Greenlane Plus™ · Coming Soon'},
    {lat:33.770,lng:-118.193,name:'Long Beach CA',op:'Greenlane',kw:400,units:6,con:'CCS',color:'#60a5fa',note:'Greenlane Plus™ · Port of Long Beach · Coming Soon'},
    {lat:37.820,lng:-121.275,name:'Lathrop CA',op:'Terawatt',kw:350,units:10,con:'CCS',color:'#60a5fa',note:'Terawatt · I-5 Corridor'},
    {lat:34.064,lng:-117.395,name:'Bloomington CA',op:'Terawatt',kw:350,units:10,con:'CCS',color:'#60a5fa',note:'Terawatt · I-10 Corridor'},
    {lat:37.522,lng:-122.040,name:'Newark CA',op:'Terawatt',kw:350,units:8,con:'CCS',color:'#60a5fa',note:'Terawatt · I-880 Corridor'},
    {lat:32.570,lng:-117.030,name:'Otay Mesa CA',op:'Terawatt',kw:350,units:8,con:'CCS',color:'#60a5fa',note:'Terawatt · San Diego–Tijuana border'},
    {lat:34.108,lng:-117.289,name:'San Bernardino CA',op:'EV Realty',kw:1200,units:2,con:'MCS',color:'#f59e0b',note:'EV Realty × Kempower · MCS Interoperability Hub · I-10/I-215'},
    {lat:51.531,lng:4.464,name:'Roosendaal',op:'Autel',kw:1200,units:2,con:'MCS',color:'#f59e0b',note:'Autel Energy · 1.2 MW MCS Validation Site · Netherlands'},
    {lat:50.39,lng:3.62,name:'Onnaing (Valenciennes)',op:'ENGIE Vianeo',kw:400,units:4,con:'CCS + MCS',color:'#34d399',note:'ENGIE Vianeo · A2/A23 Hauts-de-France · Future Windrose production site'},
    {lat:-33.94,lng:-70.72,name:'Los Lagartos',op:'Chile Electric Highway',kw:350,units:4,con:'CCS',color:'#fb923c',note:'Chile High Power Electric Highway · Route 5 Sur'},
    {lat:-34.71,lng:-71.02,name:'La Platina',op:'Chile Electric Highway',kw:350,units:4,con:'CCS',color:'#fb923c',note:'Chile High Power Electric Highway · Route 5 Sur'},
    {lat:-35.1,lng:-71.32,name:'Itahue',op:'Chile Electric Highway',kw:350,units:4,con:'CCS',color:'#fb923c',note:'Chile High Power Electric Highway · Maule Region'},
    {lat:-36.6,lng:-71.93,name:'Copelec',op:'Copelec',kw:350,units:10,con:'CCS',color:'#fb923c',note:'Copelec · Route 5 Sur · Ñuble Region · 5 double dispensers'}
  ];

  var SITES_ALL = [
    {n:'Raskone — Helsinki',r:'Heavy-vehicle service · Finland',a:'Takkatie 21, Helsinki',p:'+358 44 333 5317',h:'',lat:60.2220625,lng:24.8483253,co:'Finland'},
    {n:'Raskone — Vantaa (Airport)',r:'Heavy-vehicle service · Finland',a:'Sulankaari 36, Tuusula',p:'+358 10 232 0253',h:'Mon–Thu 7–21, Fri 7–18',lat:60.3795797,lng:25.0476566,co:'Finland'},
    {n:'Raskone — Tampere',r:'Heavy-vehicle service · Finland',a:'Perkkoonkatu 9, Tampere',p:'+358 10 232 0370',h:'Mon–Fri 7–18',lat:61.4403595,lng:23.7578255,co:'Finland'},
    {n:'Raskone — Turku',r:'Heavy-vehicle service · Finland',a:'Tiemestarinkatu 5, Turku',p:'+358 10 232 0322',h:'Mon–Thu 6–22, Fri 6–20',lat:60.4962699,lng:22.2770762,co:'Finland'},
    {n:'Raskone — Oulu',r:'Heavy-vehicle service · Finland',a:'Moreenikuja 2, Oulu',p:'+358 10 232 0500',h:'Mon–Fri 7–20',lat:65.0451707,lng:25.5466296,co:'Finland'},
    {n:'Raskone — Jyväskylä',r:'Heavy-vehicle service · Finland',a:'Sorastajantie 4, Jyväskylä',p:'+358 10 232 0785',h:'Mon–Fri 7:30–18, Sat 7:30–15:30',lat:62.2729606,lng:25.7848014,co:'Finland'},
    {n:'Raskone — Kuopio',r:'Heavy-vehicle service · Finland',a:'Virranniementie 14, Kuopio',p:'+358 10 232 0452',h:'Mon–Fri 7:30–20',lat:62.9606718,lng:27.6851601,co:'Finland'},
    {n:'Raskone — Lahti',r:'Heavy-vehicle service · Finland',a:'Alhonkatu 5, Lahti',p:'+358 10 232 0750',h:'Mon–Thu 7:30–22, Fri 7:30–20, Sat 7:30–15:30',lat:60.947895,lng:25.6500988,co:'Finland'},
    {n:'Raskone — Lappeenranta',r:'Heavy-vehicle service · Finland',a:'Myllymäenkatu 10, Lappeenranta',p:'+358 10 232 0612',h:'Mon–Thu 7:30–22, Fri 7:30–20, Sat 7:30–15',lat:61.0414999,lng:28.1976566,co:'Finland'},
    {n:'Raskone — Joensuu',r:'Heavy-vehicle service · Finland',a:'Jukolankatu 18, Joensuu',p:'+358 10 232 0799',h:'Mon–Fri 7:30–18',lat:62.6288339,lng:29.8076596,co:'Finland'},
    {n:'Raskone — Seinäjoki',r:'Heavy-vehicle service · Finland',a:'Piirturiväylä 2, Seinäjoki',p:'+358 10 232 0663',h:'Mon–Fri 6–22, Sat 7:30–15:30',lat:62.7656215,lng:22.9275927,co:'Finland'},
    {n:'Raskone — Kouvola',r:'Heavy-vehicle service · Finland',a:'Savonsuontie 8, Kouvola',p:'+358 10 232 0402',h:'Mon–Fri 7–15',lat:60.8917405,lng:26.7024365,co:'Finland'},
    {n:'Raskone — Hämeenlinna',r:'Heavy-vehicle service · Finland',a:'Itäportintie 4, Hämeenlinna',p:'+358 10 232 0270',h:'Mon–Fri 7:30–18',lat:60.9560662,lng:24.4699865,co:'Finland'},
    {n:'Raskone — Mikkeli',r:'Heavy-vehicle service · Finland',a:'Insinöörinkatu 6, Mikkeli',p:'+358 10 232 0430',h:'Mon–Fri 7–17, Sat 7–15',lat:61.6925239,lng:27.2185668,co:'Finland'},
    {n:'Raskone — Ylivieska',r:'Heavy-vehicle service · Finland',a:'Alpuumintie 2, Ylivieska',p:'+358 10 232 0545',h:'Mon–Fri 7–20',lat:64.08811,lng:24.5552737,co:'Finland'},
    {n:'Raskone — Kajaani',r:'Heavy-vehicle service · Finland',a:'Timperintie 7, Kajaani',p:'+358 10 232 0570',h:'Mon–Fri 7:30–16',lat:64.2186956,lng:27.7652913,co:'Finland'},
    {n:'Cox EV Battery — Oklahoma City',r:'North America HQ · USA',a:'',p:'',h:'',lat:35.4676,lng:-97.5164,co:'United States',c:'#b07aff'},
    {n:'Cox EV Battery — Belleville, MI',r:'Detroit region · USA',a:'',p:'',h:'',lat:42.2031,lng:-83.4852,co:'United States',c:'#b07aff'},
    {n:'Cox EV Battery — Las Vegas, NV',r:'West · USA',a:'',p:'',h:'',lat:36.1699,lng:-115.1398,co:'United States',c:'#b07aff'},
    {n:'Cox EV Battery — Conyers, GA',r:'Southeast · USA',a:'',p:'',h:'',lat:33.6676,lng:-84.0177,co:'United States',c:'#b07aff'},
    {n:'Cox EV Battery — Laredo, TX',r:'Southwest · USA',a:'',p:'',h:'',lat:27.5306,lng:-99.4803,co:'United States',c:'#b07aff'},
    {n:'Cox × DHL — Rugby, UK',r:'EV Centre of Excellence · UK',a:'',p:'',h:'',lat:52.3705,lng:-1.2658,co:'United Kingdom',c:'#b07aff'},
    {n:'Cox EV Battery — Ede, NL',r:'European HQ · Netherlands',a:'',p:'',h:'',lat:52.0402,lng:5.6648,co:'Netherlands',c:'#b07aff'},
    {n:'Top Truck — Brécé (BPL)',r:'AAG commercial-vehicle network · France',a:'ZA la Turbanière, Brécé',p:'+33 2 57 63 00 00',h:'',lat:48.1076658,lng:-1.5054977,co:'France'},
    {n:'G-Truck — Metz (PLUS)',r:'AAG commercial-vehicle network · France',a:'22 Rue Louis Bertrand, Metz',p:'',h:'',lat:49.1382681,lng:6.1746828,co:'France'},
    {n:'G-Truck — Argoeuves (Aisne Diesel)',r:'AAG commercial-vehicle network · France',a:'ZI Nord, Argoeuves',p:'+33 3 22 67 12 50',h:'',lat:49.9364764,lng:2.2598816,co:'France'},
    {n:'Team Verksted — Oslo',r:'Heavy-vehicle service · Norway',a:'Stanseveien 40, Oslo',p:'+47 48 03 44 00',h:'Mon–Thu 7–21, Fri 7–15',lat:59.9508814,lng:10.8832674,co:'Norway'},
    {n:'Team Verksted — Råde',r:'Heavy-vehicle service · Norway',a:'Langøyveien 3, Råde',p:'+47 69 28 04 20',h:'Mon–Fri 7:30–15:30',lat:59.3553319,lng:10.8547743,co:'Norway'},
    {n:'Team Verksted — Trondheim',r:'Heavy-vehicle service · Norway',a:'Kvenildsskogen 10, Tiller',p:'+47 95 42 02 40',h:'Mon–Fri 7–16',lat:63.3370794,lng:10.3618638,co:'Norway'},
    {n:'Team Verksted — Kristiansand',r:'Heavy-vehicle service · Norway',a:'Rigedalen 44, Kristiansand',p:'+47 38 14 59 20',h:'',lat:58.1399672,lng:7.9330931,co:'Norway'},
    {n:'Team Verksted — Follo (Langhus)',r:'Heavy-vehicle service · Norway',a:'Snipetjernveien 1, Langhus',p:'+47 92 28 49 69',h:'Mon–Fri 7–16',lat:59.7728585,lng:10.8477134,co:'Norway'},
    {n:'Team Verksted — Bergen',r:'Heavy-vehicle service · Norway',a:'Espehaugen 29, Blomsterdalen',p:'+47 55 22 90 80',h:'Mon–Fri 7:30–16',lat:60.2757795,lng:5.2309644,co:'Norway'},
    {n:'Team Verksted — Slemmestad',r:'Heavy-vehicle service · Norway',a:'Eternitveien 10, Slemmestad',p:'+47 92 48 89 22',h:'Mon–Fri 7–15',lat:59.7863451,lng:10.4903651,co:'Norway'},
    {n:'Team Verksted — Hallingdal (Gol)',r:'Heavy-vehicle service · Norway',a:'Husøynvegen 1, Gol',p:'+47 32 07 40 33',h:'Mon–Fri 7:30–15:30',lat:60.6958567,lng:8.9286728,co:'Norway'},
    {n:'Team Verksted — Jaren',r:'Heavy-vehicle service · Norway',a:'Jarenvegen 65, Jaren',p:'+47 48 05 44 00',h:'Mon–Fri 7–15',lat:60.3982035,lng:10.5434278,co:'Norway'},
    {n:'Team Verkstad — Partille',r:'Heavy-vehicle service · Sweden',a:'Järnringen 56, Partille',p:'+46 31 350 01 40',h:'Mon–Thu 7–24, Fri 7–15',lat:57.7402704,lng:12.0830257,co:'Sweden'},
    {n:'Skeppsbrons — Jönköping',r:'Heavy-vehicle service · Sweden',a:'Fordonsvägen 8, Jönköping',p:'+46 36 36 90 30',h:'Mon–Fri 7–16',lat:57.7438621,lng:14.1675643,co:'Sweden'},
    {n:'TJ Fordonsservice — Södertälje',r:'Heavy-vehicle service · Sweden',a:'Pålhagsvägen 4, Södertälje',p:'+46 8 550 196 50',h:'Mon–Fri 7–16',lat:59.2026494,lng:17.6566116,co:'Sweden'},
    {n:'Jyväskylä Truck Center',r:'Heavy-vehicle service · Finland',a:'Kuormaajantie 8, Jyväskylä',p:'+358 50 540 3305',h:'Mon–Fri 7–17',lat:62.2766971,lng:25.7873961,co:'Finland'},
    {n:'Xos — Los Angeles, CA',r:'Official Windrose dealer & service · United States',a:'3550 Tyburn St, Los Angeles, CA',p:'+1 818-316-1890',h:'Mon–Fri 9–17',lat:34.1193721,lng:-118.2524796,co:'United States',dealer:true},
    {n:'Trailerlogistics — Lampa, Santiago',r:'Official Windrose dealer & service · Chile',a:'Av. Crucero Peralillo 199, Parque Capital, Lampa',p:'+56 9 9863 7531',h:'',lat:-33.29,lng:-70.9,co:'Chile',dealer:true},
    {n:'SLP (Swedish Lorry Parts) — Norsborg',r:'Parts distribution · Sweden',a:'Fågelviksvägen 9, Norsborg',p:'+46 8 555 978 00',h:'Mon–Thu 8–17, Fri 8–14',lat:59.2549752,lng:17.8611896,c:'#b07aff',co:'Sweden'},
    {n:'SLP (Swedish Lorry Parts) — Gothenburg',r:'Parts distribution · Sweden',a:'William Gibsons väg 1A, Jonsered',p:'+46 8 555 978 00',h:'Mon–Thu 8–16, Fri 8–14',lat:57.7491439,lng:12.1764766,c:'#b07aff',co:'Sweden'},
    {n:'Alliance Automotive Group — Benelux (Ede)',r:'Parts distribution · AAG · Netherlands',a:'Darwinstraat 20, Ede',p:'+31 318 699 980',h:'Mon–Fri 8–17',lat:52.0309539,lng:5.6072133,c:'#b07aff',co:'Netherlands'},
    {n:'Startax — Vantaa',r:'Parts distribution · Relais Group · Finland',a:'Tähtäinkuja 2, Vantaa',p:'+358 10 322 8480',h:'Mon–Fri 8–17',lat:60.2984628,lng:24.9407627,c:'#b07aff',co:'Finland'},
    {n:'Awimex International — Simrishamn',r:'Parts distribution · Relais Group · Sweden',a:'Fabriksgatan 27, Simrishamn',p:'+46 414 160 50',h:'Mon–Thu 8–16:30, Fri 8–15',lat:55.5453981,lng:14.3312555,c:'#b07aff',co:'Sweden'},
    {n:'Lumise — Rovaniemi',r:'Parts distribution · Relais Group · Finland',a:'Teollisuustie 17, Rovaniemi',p:'+358 8 4154 1573',h:'Mon–Thu 8–16',lat:66.4897627,lng:25.6646147,c:'#b07aff',co:'Finland'},
    {n:'Adita — Helsinki',r:'Parts distribution · Relais Group · Finland',a:'Valuraudantie 1, Helsinki',p:'+358 20 778 9789',h:'Mon–Fri 7:30–17',lat:60.2435796,lng:25.0399242,c:'#b07aff',co:'Finland'},
    {n:'AutoMateriell — Lier',r:'Parts distribution · Relais Group · Norway',a:'Gilhusveien 7A, Lier',p:'+47 32 84 77 00',h:'Mon–Fri 8–16',lat:59.7520665,lng:10.2661581,c:'#b07aff',co:'Norway'},
    {n:'Nordic Lift — Tiller',r:'Parts distribution · Relais Group · Norway',a:'Østre Rosten 72, Tiller',p:'+47 73 82 43 10',h:'Mon–Fri 8–16',lat:63.3522938,lng:10.3745296,c:'#b07aff',co:'Norway'},
    {n:'AB Reservdelar (ABR) — Sollentuna',r:'Parts distribution · Relais Group · Sweden',a:'Hammarbacken 8, Sollentuna',p:'+46 8 501 030 70',h:'Mon–Fri 8–17',lat:59.4437456,lng:17.9236779,c:'#b07aff',co:'Sweden'},
    {n:'AB Reservdelar (ABR) — Malmö',r:'Parts distribution · Relais Group · Sweden',a:'Singelgatan 4, Malmö',p:'+46 8 501 030 70',h:'Mon–Fri 8–16:45',lat:55.6020754,lng:13.0396344,c:'#b07aff',co:'Sweden'},
    {n:'SEC-SET — Viborg',r:'Parts distribution · Relais Group · Denmark',a:'Mariendalsvej 28, Viborg',p:'+45 87 41 10 00',h:'Mon–Thu 8:30–16, Fri 8:30–14',lat:56.456719,lng:9.35711,c:'#b07aff',co:'Denmark'},
    {n:'LVD Lastvagnsdelar — Langhus',r:'Parts distribution · Relais Group · Norway',a:'Fugleåsen 12, Langhus',p:'+47 64 83 96 00',h:'Mon–Fri 7–16',lat:59.7720392,lng:10.8556376,c:'#b07aff',co:'Norway'},
    {n:'Big Wheels — Crestmead QLD',r:'Service & parts · Big Wheels · Australia',a:'1/116 Magnesium Drive, Crestmead, QLD',p:'',h:'',lat:-27.6585,lng:153.1015,co:'Australia'},
    {n:'Big Wheels — Bundaberg',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-24.8661,lng:152.3489,co:'Australia'},
    {n:'Big Wheels — Gold Coast',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-27.9764,lng:153.364,co:'Australia'},
    {n:'Big Wheels — Mackay',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-21.17,lng:149.185,co:'Australia'},
    {n:'Big Wheels — North Brisbane',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-27.436,lng:153.085,co:'Australia'},
    {n:'Big Wheels — Rocklea',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-27.556,lng:153.004,co:'Australia'},
    {n:'Big Wheels — Sunshine Coast',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-26.679,lng:153.054,co:'Australia'},
    {n:'Big Wheels — Toowoomba',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-27.561,lng:151.954,co:'Australia'},
    {n:'Big Wheels — Townsville',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-19.253,lng:146.718,co:'Australia'},
    {n:'Big Wheels — Arndell Park NSW',r:'Service & parts · Big Wheels · Australia',a:'49 Holbeche Road, Arndell Park, NSW',p:'',h:'',lat:-33.795,lng:150.873,co:'Australia'},
    {n:'Big Wheels — Central Coast',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-33.427,lng:151.321,co:'Australia'},
    {n:'Big Wheels — Coffs Harbour',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-30.2963,lng:153.1157,co:'Australia'},
    {n:'Big Wheels — Tamworth',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-31.09,lng:150.929,co:'Australia'},
    {n:'Big Wheels — Laverton North VIC',r:'Service & parts · Big Wheels · Australia',a:'55 Cherry Lane, Laverton North, VIC',p:'',h:'',lat:-37.819,lng:144.77,co:'Australia'},
    {n:'Big Wheels — Dandenong',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-37.987,lng:145.215,co:'Australia'},
    {n:'Big Wheels — Morwell',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-38.235,lng:146.394,co:'Australia'},
    {n:'Big Wheels — Pakenham',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-38.07,lng:145.485,co:'Australia'},
    {n:'Big Wheels — Perth',r:'Service & parts · Big Wheels · Australia',a:'',p:'',h:'',lat:-31.9505,lng:115.8605,co:'Australia'}
  ];

  var SERVICE = SITES_ALL.filter(function(s){ return !s.c || s.dealer; });
  var PARTS   = SITES_ALL.filter(function(s){ return !!s.c || s.dealer; });

  var MFG_CITIES = {
    shiyan:   {lon:110.8,  lat:32.6,  role:'cn',  label:'Shiyan',          lx:-55, ly:0,   partner:'Hande',   partnerRole:'Electric Drive Axle'},
    hefei:    {lon:117.3,  lat:31.9,  role:'cn',  label:'Hefei',           lx:-55, ly:14,  partner:'CALB',    partnerRole:'Battery System'},
    shanghai: {lon:121.5,  lat:31.2,  role:'hub', label:'Suzhou/Shanghai', lx:14,  ly:-18, partner:'Zhenghe', partnerRole:'Truck Cab'},
    australia:{lon:134,    lat:-24,   role:'au',  label:'Australia',       lx:12,  ly:18},
    chile:    {lon:-70.7,  lat:-33.4, role:'au',  label:'Chile',           lx:-14, ly:18},
    vancouver:{lon:-123.1, lat:49.3,  role:'us',  label:'Vancouver',       lx:10,  ly:-30, partner:'Canada Launch', partnerRole:'Market Entry'},
    la:       {lon:-118.2, lat:34,    role:'hub', label:'Los Angeles',     lx:10,  ly:18},
    antwerp:  {lon:4.4,    lat:51.2,  role:'hub', label:'Antwerp',         lx:14,  ly:-28, partner:'Antwerp Port',  partnerRole:'European Assembly'},
    uk:       {lon:-1.5,   lat:52.5,  role:'eu',  label:'UK',              lx:-22, ly:-14, partner:'HORIBA MIRA',   partnerRole:'Validation & Testing'},
    finland:  {lon:25,     lat:62,    role:'eu',  label:'Finland',         lx:10,  ly:-18},
    oslo:     {lon:10.7,   lat:59.9,  role:'eu',  label:'Oslo',            lx:14,  ly:-14},
    france:   {lon:2.3,    lat:48.9,  role:'eu',  label:'France',          lx:-22, ly:22},
    seattle:  {lon:-122.3, lat:47.6,  role:'us',  label:'Seattle',         lx:-55, ly:14,  partner:'Aertssen', partnerRole:'Manufacturing'},
    laredo:   {lon:-99.5,  lat:27.5,  role:'us',  label:'Laredo TX',       lx:10,  ly:44},
    savannah: {lon:-81.1,  lat:32.1,  role:'us',  label:'Savannah',        lx:10,  ly:28,  partner:'Aertssen', partnerRole:'Manufacturing'}
  };

  var MFG_HUB_COL = {hub:'#4a9eff', cn:'#f59e0b', eu:'#34d399', us:'#a78bfa', au:'#fb923c'};

  var COUNTRY_NAMES = {
    4:'Afghanistan',8:'Albania',12:'Algeria',24:'Angola',32:'Argentina',
    36:'Australia',40:'Austria',50:'Bangladesh',56:'Belgium',64:'Bhutan',
    68:'Bolivia',76:'Brazil',100:'Bulgaria',104:'Myanmar',116:'Cambodia',
    120:'Cameroon',124:'Canada',140:'C. African Rep.',144:'Sri Lanka',
    148:'Chad',152:'Chile',156:'China',170:'Colombia',178:'Congo',
    180:'DR Congo',192:'Cuba',203:'Czechia',208:'Denmark',218:'Ecuador',
    231:'Ethiopia',246:'Finland',250:'France',276:'Germany',288:'Ghana',
    300:'Greece',304:'Greenland',320:'Guatemala',324:'Guinea',340:'Honduras',
    348:'Hungary',356:'India',360:'Indonesia',364:'Iran',368:'Iraq',
    372:'Ireland',380:'Italy',392:'Japan',400:'Jordan',404:'Kenya',
    408:'N. Korea',410:'S. Korea',418:'Laos',430:'Liberia',434:'Libya',
    450:'Madagascar',458:'Malaysia',484:'Mexico',496:'Mongolia',504:'Morocco',
    508:'Mozambique',516:'Namibia',524:'Nepal',528:'Netherlands',562:'Niger',
    566:'Nigeria',578:'Norway',586:'Pakistan',598:'Papua New Guinea',
    604:'Peru',608:'Philippines',616:'Poland',620:'Portugal',642:'Romania',
    643:'Russia',682:'Saudi Arabia',686:'Senegal',706:'Somalia',
    710:'South Africa',724:'Spain',729:'Sudan',752:'Sweden',756:'Switzerland',
    760:'Syria',762:'Tajikistan',764:'Thailand',792:'Turkey',795:'Turkmenistan',
    800:'Uganda',804:'Ukraine',784:'UAE',818:'Egypt',826:'UK',
    840:'United States',858:'Uruguay',860:'Uzbekistan',862:'Venezuela',
    704:'Vietnam',887:'Yemen',894:'Zambia',716:'Zimbabwe'
  };

  var ARCTIC_PTS = [
    [121.5,31.2],[130,38],[135,42],[140,46],[145,50],
    [150,55],[158,59],[163,62],[168,65],[170,66],
    [168,69],[160,72],[148,74],[130,76],[105,77],[80,77],
    [57,75],[40,73],[28,71.5],[20,70],[16,68],[10,63],[8,61],[10.7,59.9]
  ];

  /* ── Sea-route helper (great-circle waypoints through major shipping lanes) */
  function seaRoute(polLng, polLat, podLng, podLat) {
    function reg(lng, lat) {
      if (lat > 15 && lng > 100 && lng < 150) return 'east-asia';
      if (lat >= -10 && lat <= 15 && lng > 95 && lng < 150) return 'se-asia';
      if (lat > 20 && lng > -30 && lng < 50) return 'europe';
      if (lat > 20 && lng > -130 && lng < -105) return 'us-west';
      if (lat > 15 && lng > -90 && lng < -60) return 'us-east';
      if (lat < -10 && lng > 135 && lng <= 180) return 'aus-east';
      if (lat < -10 && lng > 100 && lng <= 135) return 'aus-west';
      if (lat < -10 && lng < -35 && lng > -85) return 'south-america';
      return 'other';
    }
    var polR = reg(polLng, polLat), podR = reg(podLng, podLat);
    var mid = [];
    var suezFwd = [[120,27],[119,24],[116,21],[112,17],[109,13],[107,9],[105,3],[103.8,1.3],[101,2],[99.5,3.5],[98,5],[96,7],[91,8],[87,7],[83,6],[80,6],[76,8],[71,12],[66,14],[62,16],[57,21],[53,13],[49,12],[46,12],[43,12.5],[41,15],[38,18],[36,22],[34,26],[33,28],[32.5,29.9],[32.3,30.6],[32.3,31.3],[30,32],[27,34],[26,36],[23,35],[18,36],[14,37],[12,37],[6,38],[1,39],[-4,36.5],[-5.4,35.9],[-8,37],[-9,43],[-8,47],[-5,48],[-2,50],[2,51.5]];
    // Europe ↔ Aden (Suez Canal + Red Sea leg)
    var euToAden = [[2,51.5],[-2,50],[-5,48],[-8,47],[-9,43],[-8,37],[-5.4,35.9],[-4,36.5],[1,39],[6,38],[12,37],[14,37],[18,36],[23,35],[26,36],[27,34],[30,32],[32.3,31.3],[32.3,30.6],[32.5,29.9],[33,28],[34,26],[36,22],[38,18],[41,15],[43,12.5],[46,12],[49,12],[53,13],[57,21]];
    // Aden → Australian west coast (Indian Ocean)
    var adenToAusW = [[60,16],[63,11],[65,7],[68,3],[71,-1],[74,-4],[78,-7],[82,-8],[86,-8],[90,-7],[94,-5],[98,-4],[102,-5],[106,-8],[109,-12],[112,-18],[114,-26]];
    // Western Australia → eastern Australia leg
    var ausWToE = [[118,-30],[123,-34],[130,-36],[135,-37],[140,-37]];
    if ((polR==='east-asia'||polR==='se-asia') && podR==='europe') { mid = suezFwd; }
    else if (polR==='europe' && (podR==='east-asia'||podR==='se-asia')) { mid = suezFwd.slice().reverse(); }
    else if ((polR==='east-asia'||polR==='se-asia') && (podR==='us-west'||podR==='us-east')) {
      mid = [[125,34],[140,38],[155,42],[170,46],[178,48],[-175,50],[-165,52],[-150,51],[-135,48],[-125,46],[-122,38]];
    } else if ((polR==='us-west'||polR==='us-east') && (podR==='east-asia'||podR==='se-asia')) {
      mid = [[-122,38],[-125,46],[-135,48],[-150,51],[-165,52],[-175,50],[178,48],[170,46],[155,42],[140,38],[125,34]];
    } else if (polR==='europe' && (podR==='aus-west'||podR==='aus-east')) {
      mid = euToAden.concat(adenToAusW);
      if (podR==='aus-east') mid = mid.concat(ausWToE);
    } else if ((polR==='aus-west'||polR==='aus-east') && podR==='europe') {
      var fromAus = (polR==='aus-east') ? ausWToE.slice().reverse().concat(adenToAusW.slice().reverse()) : adenToAusW.slice().reverse();
      mid = fromAus.concat(euToAden.slice().reverse());
    } else if ((polR==='east-asia'||polR==='se-asia') && podR==='aus-west') {
      // Via South China Sea → Malacca Strait → Timor Sea
      mid = [[118,22],[114,16],[110,10],[107,5],[104,2],[102,0],[101,-2],[99,-5],[97,-7],[97,-10],[99,-13],[102,-16],[105,-18],[109,-18],[112,-22],[113,-27]];
    } else if (polR==='aus-west' && (podR==='east-asia'||podR==='se-asia')) {
      mid = [[113,-27],[112,-22],[109,-18],[105,-18],[102,-16],[99,-13],[97,-10],[97,-7],[99,-5],[101,-2],[102,0],[104,2],[107,5],[110,10],[114,16],[118,22]];
    } else if ((polR==='east-asia'||polR==='se-asia') && podR==='aus-east') {
      // Via Coral Sea south
      mid = [[120,25],[118,18],[116,12],[115,8],[115,3],[116,-2],[117,-7],[118,-12],[118,-18],[120,-23],[122,-28],[126,-33],[132,-36],[137,-37],[140,-37]];
    } else if (polR==='aus-east' && (podR==='east-asia'||podR==='se-asia')) {
      mid = [[140,-37],[137,-37],[132,-36],[126,-33],[122,-28],[120,-23],[118,-18],[118,-12],[117,-7],[116,-2],[115,3],[115,8],[116,12],[118,18],[120,25]];
    }
    var coords = [[polLng,polLat]].concat(mid, [[podLng,podLat]]);
    return {type:'Feature', geometry:{type:'LineString', coordinates:coords}};
  }

  /* ── Static representative shipping routes ───────────────────────────── */
  var STATIC_ROUTES = [
    seaRoute(121.5,31.2, 4.4,51.2),        // Shanghai → Antwerp (Suez Canal)
    seaRoute(121.5,31.2, -118.2,34),        // Shanghai → Los Angeles (Pacific)
    seaRoute(121.5,31.2, 144.9,-37.8),      // Shanghai → Melbourne (Coral Sea)
    seaRoute(4.4,51.2, -81.1,32.1),         // Antwerp → Savannah (North Atlantic)
    seaRoute(4.4,51.2, 115.7,-32),          // Antwerp → Fremantle (Suez + Indian Ocean)
    seaRoute(-118.2,34, -70.7,-33.4)        // Los Angeles → Valparaíso (Pacific)
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     GLOBE FACTORY
  ═══════════════════════════════════════════════════════════════════════════ */

  window.WindroseGlobe = {
    CHARGING: CHARGING,
    init: function (containerId, opts) {
      opts = opts || {};
      var el = document.getElementById(containerId);
      if (!el) { console.warn('WindroseGlobe: container #' + containerId + ' not found'); return; }

      var availLayers = opts.layers || ['mcs','ccs'];
      var activeLayers = new Set(opts.defaultLayers != null ? opts.defaultLayers : availLayers);

      el.style.position = 'relative';
      el.style.background = '#040c1a';
      el.style.overflow = 'hidden';
      el.style.touchAction = 'none';

      // Fill viewport height minus nav bars (~130px for topbar+langrow+nav)
      var _initH = Math.max(320, window.innerHeight - 130);
      el.style.height = _initH + 'px';
      el.style.minHeight = '320px';
      el.style.maxHeight = 'none';

      // Tooltip div
      var tooltip = document.createElement('div');
      tooltip.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;background:rgba(4,10,22,0.97);border:1px solid rgba(74,158,255,0.35);border-radius:6px;padding:8px 12px;font-family:"DM Sans",sans-serif;font-size:0.875rem;color:#e8f0ff;max-width:260px;display:none;line-height:1.45;box-shadow:0 4px 20px rgba(0,0,0,0.6);';
      document.body.appendChild(tooltip);

      // Layer toggle bar (hidden when showLayerBar === false)
      var bar = buildLayerBar(availLayers, activeLayers);
      if (opts.showLayerBar !== false) el.appendChild(bar);

      // SVG container
      var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgEl.setAttribute('width', '100%');
      svgEl.style.cssText = 'display:block;cursor:grab;width:100%;height:100%;touch-action:none;';
      el.appendChild(svgEl);

      // Load world
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
        .then(function(r){ return r.json(); })
        .then(function(world) {
          var api = opts.flat
            ? buildFlatMap(svgEl, el, world, availLayers, activeLayers, bar, tooltip, opts)
            : buildGlobe(svgEl, el, world, availLayers, activeLayers, bar, tooltip, opts);
          if (typeof opts.onReady === 'function') opts.onReady(api);
        })
        .catch(function() {
          el.innerHTML += '<p style="color:rgba(255,255,255,0.3);text-align:center;padding:2rem;">Map requires internet connection</p>';
        });
    }
  };

  /* ─── Layer toggle bar ─────────────────────────────────────────────────── */
  var LAYER_META = {
    mcs:      {label:'⚡ MCS',                 color:'#f59e0b'},
    ccs:      {label:'⚡ CCS',                 color:'#60a5fa'},
    service:  {label:'🔧 After-Sales Service', color:'#4affb0'},
    parts:    {label:'📦 Spare Parts',         color:'#b07aff'},
    shipping: {label:'🚢 Supply Chain',        color:'#f59e0b'}
  };

  function buildLayerBar(availLayers, activeLayers) {
    var bar = document.createElement('div');
    bar.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:10;display:flex;gap:5px;padding:5px 10px;background:rgba(6,15,30,0.9);border:1px solid rgba(74,158,255,0.2);border-radius:20px;backdrop-filter:blur(6px);flex-wrap:wrap;justify-content:center;max-width:calc(100% - 20px);box-sizing:border-box;';
    availLayers.forEach(function(id) {
      var meta = LAYER_META[id]; if (!meta) return;
      var btn = document.createElement('button');
      btn.dataset.layer = id;
      var active = activeLayers.has(id);
      btn.style.cssText = 'background:none;border:1px solid ' + meta.color + ';color:' + meta.color + ';padding:3px 10px;border-radius:12px;font-family:"DM Sans",sans-serif;font-size:0.8rem;cursor:pointer;transition:opacity 0.15s,background 0.15s;white-space:nowrap;';
      btn.textContent = meta.label;
      btn.style.opacity = active ? '1' : '0.3';
      btn.style.background = active ? 'rgba(255,255,255,0.06)' : 'none';
      btn.addEventListener('click', function() {
        var lid = this.dataset.layer;
        var isActive = activeLayers.has(lid);
        if (isActive) { activeLayers.delete(lid); this.style.opacity='0.3'; this.style.background='none'; }
        else           { activeLayers.add(lid);    this.style.opacity='1';   this.style.background='rgba(255,255,255,0.06)'; }
        // Trigger redraw event
        svgEl && svgEl.dispatchEvent(new CustomEvent('layertoggle', {detail:{id:lid, active:!isActive}}));
      });
      bar.appendChild(btn);
    });
    var svgEl = null; // closed over, set after svg created
    bar._setSvg = function(s){ svgEl = s; };
    return bar;
  }

  /* ─── Places panel helpers ────────────────────────────────────────────── */
  var _placesCache = {};

  function _timeAgo(isoStr) {
    if (!isoStr) return null;
    var ms = Date.now() - new Date(isoStr).getTime();
    var days = Math.floor(ms / 86400000);
    if (days < 1)  return 'today';
    if (days < 7)  return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    var weeks = Math.floor(days / 7);
    if (weeks < 5) return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
    var months = Math.floor(days / 30);
    if (months < 13) return months + ' month' + (months > 1 ? 's' : '') + ' ago';
    var years = Math.floor(days / 365);
    return years + ' year' + (years > 1 ? 's' : '') + ' ago';
  }

  function _stars(rating) {
    if (!rating) return '';
    var full = Math.round(rating);
    var s = '';
    for (var i = 1; i <= 5; i++) s += i <= full ? '★' : '☆';
    return s;
  }

  /* ─── Core globe ──────────────────────────────────────────────────────── */
  function buildGlobe(svgEl, container, world, availLayers, activeLayers, bar, tooltip, opts) {
    bar._setSvg(svgEl);

    // ── Location count badge ────────────────────────────────────────────────
    var countEl;
    if (opts.showLayerBar !== false) {
      countEl = document.createElement('span');
      countEl.style.cssText = 'font-family:"DM Sans",sans-serif;font-size:0.75rem;color:rgba(200,216,240,0.5);padding:0 2px 0 8px;white-space:nowrap;align-self:center;border-left:1px solid rgba(74,158,255,0.18);margin-left:4px;';
      bar.appendChild(countEl);
    } else {
      countEl = document.createElement('div');
      countEl.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:10;padding:4px 14px;background:rgba(6,15,30,0.9);border:1px solid rgba(74,158,255,0.2);border-radius:20px;backdrop-filter:blur(6px);font-family:"DM Sans",sans-serif;font-size:0.75rem;color:rgba(200,216,240,0.65);white-space:nowrap;pointer-events:none;';
      container.appendChild(countEl);
    }
    function updateLocationCount() {
      var hasMcs = activeLayers.has('mcs'), hasCcs = activeLayers.has('ccs');
      var hasSvc = activeLayers.has('service'), hasPrt = activeLayers.has('parts');
      var hasShp = activeLayers.has('shipping');
      var n = 0;
      if (hasMcs || hasCcs) n += CHARGING.filter(function(s){
        return (hasMcs && s.con && s.con.indexOf('MCS') !== -1) ||
               (hasCcs && s.con && s.con.indexOf('CCS') !== -1);
      }).length;
      if (hasSvc || hasPrt) n += SITES_ALL.filter(function(s){
        return (hasSvc && (!s.c || s.dealer)) || (hasPrt && (!!s.c || s.dealer));
      }).length;
      if (hasShp) n += Object.keys(MFG_CITIES).length;
      countEl.textContent = n ? n + ' locations' : '';
    }
    updateLocationCount();
    svgEl.addEventListener('layertoggle', updateLocationCount);

    var svg = d3.select(svgEl);
    var W = container.offsetWidth || 800;
    var isMobile = window.innerWidth < 640;
    var H = container.offsetHeight || (isMobile ? 320 : 520);
    svgEl.setAttribute('height', H);
    W = container.offsetWidth || W;

    var rot = [10, -25, 0]; // default: centered roughly on Eurasia
    // scaleBase driven by H so globe always fills height; (W-6)/2 caps for narrow parents
    var scaleBase = Math.min(H / 2.05, (W - 6) / 2);
    var scaleK = 1;

    var proj = d3.geoOrthographic()
      .scale(scaleBase)
      .translate([W/2, H/2])
      .rotate(rot)
      .clipAngle(90);
    var pathFn = d3.geoPath().projection(proj);

    var g = svg.append('g');

    // ── Space background rect (fills SVG behind sphere and stars)
    g.append('rect').attr('x',0).attr('y',0).attr('width','100%').attr('height','100%').attr('fill','#040c1a');

    // ── Starfield (rendered under sphere so stars appear only in outer space around globe)
    (function() {
      if (!document.getElementById('wg-star-css')) {
        var st = document.createElement('style');
        st.id = 'wg-star-css';
        st.textContent = '@keyframes wg-twinkle{0%,100%{opacity:1}50%{opacity:0.1}}';
        document.head.appendChild(st);
      }
      var sg = g.append('g').attr('class','wg-stars').attr('pointer-events','none');
      var spread = Math.max(W, H) * 1.5;
      for (var i = 0; i < 320; i++) {
        var sx = Math.random() * spread - spread * 0.1;
        var sy = Math.random() * spread - spread * 0.1;
        var r  = Math.random() < 0.08 ? 2.0 : Math.random() < 0.3 ? 1.2 : 0.6;
        var op = (0.3 + Math.random() * 0.7).toFixed(2);
        var col = Math.random() < 0.1 ? '#b8d4ff' : Math.random() < 0.1 ? '#ffdcaa' : '#ffffff';
        var dur = (2.5 + Math.random() * 5).toFixed(1);
        var del = -(Math.random() * 9).toFixed(1);
        sg.append('circle')
          .attr('cx', sx).attr('cy', sy).attr('r', r)
          .attr('fill', col).attr('opacity', op)
          .attr('style', 'animation:wg-twinkle ' + dur + 's ease-in-out ' + del + 's infinite');
      }
    })();

    var sphereBg  = g.append('path').datum({type:'Sphere'}).attr('fill','#070e1f').attr('d', pathFn);
    var landLayer  = g.append('path')
      .datum(topojson.feature(world, world.objects.countries))
      .attr('fill','#0f2340').attr('stroke','#1d4a6e').attr('stroke-width', 0.5)
      .attr('d', pathFn);
    var countryNameLayer = g.append('g').attr('class','wg-country-names');
    topojson.feature(world, world.objects.countries).features.forEach(function(feat) {
      var name = COUNTRY_NAMES[+feat.id];
      if (!name) return;
      var c = d3.geoCentroid(feat);
      if (!c || isNaN(c[0]) || isNaN(c[1])) return;
      countryNameLayer.append('text')
        .datum({lon: c[0], lat: c[1]})
        .attr('text-anchor','middle')
        .attr('fill','rgba(180,210,255,0.45)')
        .attr('font-size', 7.5)
        .attr('font-family','Barlow Condensed,sans-serif')
        .attr('font-weight',400)
        .attr('letter-spacing','0.06em')
        .attr('pointer-events','none')
        .text(name);
    });
    var routeLayer  = g.append('g').attr('class','wg-routes');
    var arcticLayer = g.append('g').attr('class','wg-arctic');
    var cityLayer   = g.append('g').attr('class','wg-cities');
    var ptLayer     = g.append('g').attr('class','wg-points');
    var circleLayer      = g.append('g').attr('class','wg-circle');
    var drivingRouteLayer = g.append('g').attr('class','wg-driving-route');

    /* ── Point layer data ─────────────────────────────────────────────────── */
    function isVisible(lon, lat) {
      var r = proj.rotate();
      var clon = -r[0]*Math.PI/180, clat = -r[1]*Math.PI/180;
      var phi = lat*Math.PI/180, lam = lon*Math.PI/180;
      return Math.sin(phi)*Math.sin(clat)+Math.cos(phi)*Math.cos(clat)*Math.cos(lam-clon) > 0;
    }

    // MCS charging layer
    var mcsDots = ptLayer.append('g').attr('class','wg-layer-mcs');
    CHARGING.filter(function(s){ return s.con && s.con.indexOf('MCS') !== -1; }).forEach(function(s) {
      mcsDots.append('circle')
        .datum(s)
        .attr('r', 5)
        .attr('fill', '#f59e0b')
        .attr('stroke','rgba(255,255,255,0.7)').attr('stroke-width',0.8)
        .style('cursor','pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildChargingTip(d)); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); showStationPanel(d); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });
    // CCS charging layer
    var ccsDots = ptLayer.append('g').attr('class','wg-layer-ccs');
    CHARGING.filter(function(s){ return s.con && s.con.indexOf('CCS') !== -1; }).forEach(function(s) {
      ccsDots.append('circle')
        .datum(s)
        .attr('r', 4.5)
        .attr('fill', '#60a5fa')
        .attr('stroke','rgba(255,255,255,0.7)').attr('stroke-width',0.8)
        .style('cursor','pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildChargingTip(d)); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); showStationPanel(d); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    // Service
    var serviceDots = ptLayer.append('g').attr('class','wg-layer-service');
    SERVICE.forEach(function(s) {
      serviceDots.append('circle')
        .datum(s)
        .attr('r', 4)
        .attr('fill','#4affb0')
        .attr('stroke','rgba(255,255,255,0.6)').attr('stroke-width',0.7)
        .style('cursor','pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildSiteTip(d, '#4affb0')); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    // Parts
    var partsDots = ptLayer.append('g').attr('class','wg-layer-parts');
    PARTS.forEach(function(s) {
      partsDots.append('circle')
        .datum(s)
        .attr('r', 4)
        .attr('fill','#b07aff')
        .attr('stroke','rgba(255,255,255,0.6)').attr('stroke-width',0.7)
        .style('cursor','pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildSiteTip(d, '#b07aff')); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    // Shipping routes
    STATIC_ROUTES.forEach(function(feat) {
      routeLayer.append('path')
        .datum(feat)
        .attr('fill','none').attr('stroke','#f59e0b').attr('stroke-width',1.2)
        .attr('stroke-dasharray','5 9').attr('opacity',0.55)
        .attr('d', pathFn);
    });
    // Arctic lane
    arcticLayer.append('path')
      .datum({type:'Feature',geometry:{type:'LineString',coordinates:ARCTIC_PTS}})
      .attr('fill','none').attr('stroke','#67e8f9').attr('stroke-width',1.5)
      .attr('stroke-dasharray','6 8').attr('opacity',0.7)
      .attr('d', pathFn);

    // Manufacturing cities
    var cityEntries = Object.keys(MFG_CITIES).map(function(k){ var c=MFG_CITIES[k]; c.key=k; return c; });
    cityEntries.forEach(function(c) {
      var col = MFG_HUB_COL[c.role] || '#4a9eff';
      var r = c.role === 'hub' ? 7 : 5;
      cityLayer.append('circle')
        .datum(c).attr('r', r)
        .attr('fill', col).attr('stroke','rgba(255,255,255,0.8)').attr('stroke-width',1.2)
        .style('cursor','pointer')
        .on('mousemove', function(ev, d) {
          var title = d.partner ? d.partner : d.label;
          var sub   = d.partner ? d.partnerRole : d.role.toUpperCase() + ' node';
          var loc   = d.partner ? '<span style="color:rgba(180,200,255,0.35);font-size:0.75rem;">' + d.label + '</span><br>' : '';
          var hint  = d.partner ? '<span style="color:rgba(74,158,255,0.55);font-size:0.75rem;">Click to view ↓</span>' : '';
          showTip(ev,
            '<span style="color:'+col+';font-weight:700;">' + title + '</span><br>'
            + '<span style="color:rgba(180,200,255,0.5);font-size:0.8rem;">' + sub + '</span><br>'
            + loc + hint);
        })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) {
          hideTip();
          if (typeof opts.onCityClick === 'function') opts.onCityClick(d.key, d);
        });
      // city text labels hidden per design request
    });

    /* ── Visibility / redraw ─────────────────────────────────────────────── */
    function redraw() {
      sphereBg.attr('d', pathFn);
      landLayer.attr('d', pathFn);
      countryNameLayer.selectAll('text').each(function(d) {
        if (!d) return;
        var xy = proj([d.lon, d.lat]);
        var vis = xy && isVisible(d.lon, d.lat);
        d3.select(this)
          .attr('x', xy ? xy[0] : -999)
          .attr('y', xy ? xy[1] : -999)
          .attr('display', vis ? null : 'none');
      });

      // Routes
      routeLayer.selectAll('path').attr('d', function(d){ return pathFn(d) || ''; });
      arcticLayer.selectAll('path').attr('d', function(d){ return pathFn(d) || ''; });

      // Points (charging / service / parts)
      ptLayer.selectAll('circle').each(function(d) {
        if (!d) return;
        var lon = d.lng != null ? d.lng : d.lon;
        var lat = d.lat;
        var xy = proj([lon, lat]);
        var vis = xy && isVisible(lon, lat);
        d3.select(this)
          .attr('cx', xy ? xy[0] : -999)
          .attr('cy', xy ? xy[1] : -999)
          .attr('display', vis ? null : 'none');
      });

      // City dots and labels
      cityLayer.selectAll('circle').each(function(d) {
        if (!d) return;
        var xy = proj([d.lon, d.lat]);
        var vis = xy && isVisible(d.lon, d.lat);
        d3.select(this)
          .attr('cx', xy ? xy[0] : -999)
          .attr('cy', xy ? xy[1] : -999)
          .attr('display', vis ? null : 'none');
      });
      cityLayer.selectAll('text').each(function(d) {
        if (!d) return;
        var xy = proj([d.lon, d.lat]);
        var vis = xy && isVisible(d.lon, d.lat);
        d3.select(this)
          .attr('x', xy ? xy[0] + (d.lx || 10) : -999)
          .attr('y', xy ? xy[1] + (d.ly || 4) : -999)
          .attr('display', vis ? null : 'none');
      });

      // Range circle
      circleLayer.selectAll('path').attr('d', function(d){ return pathFn(d) || ''; });
      // Driving route
      drivingRouteLayer.selectAll('path').attr('d', function(d){ return pathFn(d) || ''; });
      circleLayer.selectAll('circle').each(function() {
        var lng = +this.getAttribute('data-lng'), lat = +this.getAttribute('data-lat');
        if (!lng && !lat) return;
        var xy = proj([lng, lat]);
        var vis = xy && isVisible(lng, lat);
        d3.select(this).attr('cx', xy?xy[0]:-999).attr('cy', xy?xy[1]:-999).attr('display', vis?null:'none');
      });
    }

    /* ── Layer visibility ────────────────────────────────────────────────── */
    function applyLayerVisibility() {
      mcsDots.style('display',      activeLayers.has('mcs')      ? null : 'none');
      ccsDots.style('display',      activeLayers.has('ccs')      ? null : 'none');
      serviceDots.style('display',  activeLayers.has('service')  ? null : 'none');
      partsDots.style('display',    activeLayers.has('parts')    ? null : 'none');
      var shippingVis = activeLayers.has('shipping') ? null : 'none';
      routeLayer.style('display',   shippingVis);
      arcticLayer.style('display',  shippingVis);
      cityLayer.style('display',    shippingVis);
    }
    applyLayerVisibility();
    svgEl.addEventListener('layertoggle', function() { applyLayerVisibility(); });

    /* ── Drag ────────────────────────────────────────────────────────────── */
    svg.call(d3.drag()
      .clickDistance(4)
      .filter(function(ev) { return !ev.touches || ev.touches.length === 1; })
      .on('start', function(){ svg.style('cursor','grabbing'); hideTip(); })
      .on('drag', function(ev) {
        rot[0] += ev.dx * 0.4;
        rot[1] -= ev.dy * 0.4;
        rot[1] = Math.max(-88, Math.min(88, rot[1]));
        proj.rotate(rot);
        redraw();
      })
      .on('end', function(){ svg.style('cursor','grab'); })
    );

    /* ── All-edge + corner resize handles ──────────────────────────────── */
    (function() {
      var E = 10, C = 16; // edge and corner hit-area px
      // [cursor, top, right, bottom, left, w, h, dxSign, dySign, showBar]
      var defs = [
        ['s-resize',  'auto', C,      0,      C,      null, E,    0,  1, true ],
        ['n-resize',  0,      C,      'auto', C,      null, E,    0, -1, false],
        ['e-resize',  C,      0,      C,      'auto', E,    null, 1,  0, false],
        ['w-resize',  C,      'auto', C,      0,      E,    null,-1,  0, false],
        ['se-resize', 'auto', 0,      0,      'auto', C,    C,    1,  1, false],
        ['sw-resize', 'auto','auto',  0,      0,      C,    C,   -1,  1, false],
        ['ne-resize', 0,      0,   'auto',   'auto',  C,    C,    1, -1, false],
        ['nw-resize', 0,   'auto', 'auto',    0,      C,    C,   -1, -1, false],
      ];
      defs.forEach(function(d) {
        var cursor=d[0], top=d[1], right=d[2], bottom=d[3], left=d[4];
        var w=d[5], h=d[6], dxSign=d[7], dySign=d[8], showBar=d[9];
        var handle = document.createElement('div');
        var cs = 'position:absolute;z-index:20;cursor:'+cursor+';';
        cs += top    ==='auto'?'top:auto;'   :'top:'   +(top===0?'0':top+'px')+';';
        cs += right  ==='auto'?'right:auto;' :'right:' +(right===0?'0':right+'px')+';';
        cs += bottom ==='auto'?'bottom:auto;':'bottom:'+(bottom===0?'0':bottom+'px')+';';
        cs += left   ==='auto'?'left:auto;'  :'left:'  +(left===0?'0':left+'px')+';';
        cs += w!==null?'width:'+w+'px;':'width:calc(100% - '+(2*C)+'px);';
        cs += h!==null?'height:'+h+'px;':'height:calc(100% - '+(2*C)+'px);';
        handle.style.cssText = cs;
        if (showBar) {
          handle.style.background = 'linear-gradient(to top,rgba(4,12,26,0.8),transparent)';
          handle.style.display = 'flex';
          handle.style.alignItems = 'center';
          handle.style.justifyContent = 'center';
          handle.innerHTML = '<div style="width:36px;height:3px;border-radius:2px;background:rgba(74,158,255,0.45);pointer-events:none;transition:background 0.15s;"></div>';
          handle.addEventListener('mouseover', function(){ this.querySelector('div').style.background='rgba(74,158,255,0.9)'; });
          handle.addEventListener('mouseout',  function(){ this.querySelector('div').style.background='rgba(74,158,255,0.45)'; });
        }
        function startResize(sx, sy) {
          var startH = container.offsetHeight, startW = container.offsetWidth;
          function doMove(ex, ey) {
            if (dySign !== 0) {
              var nH = Math.max(280, startH + (ey - sy) * dySign);
              container.style.height = nH + 'px';
              container.style.minHeight = nH + 'px';
              container.style.maxHeight = 'none';
              H = container.offsetHeight;
            }
            if (dxSign !== 0) {
              var nW = Math.max(280, startW + (ex - sx) * dxSign);
              container.style.width = nW + 'px';
              container.style.maxWidth = 'none';
              W = container.offsetWidth;
            }
            scaleBase = Math.min(H / 2.05, (W - 6) / 2);
            proj.scale(scaleBase * scaleK).translate([W/2, H/2]);
            svgEl.setAttribute('height', H);
            redraw();
          }
          function onMM(e) { doMove(e.clientX, e.clientY); }
          function onTM(e) { if(e.touches.length===1) doMove(e.touches[0].clientX, e.touches[0].clientY); }
          function onUp() {
            document.removeEventListener('mousemove', onMM);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onTM);
            document.removeEventListener('touchend', onUp);
          }
          document.addEventListener('mousemove', onMM);
          document.addEventListener('mouseup', onUp);
          document.addEventListener('touchmove', onTM, {passive:false});
          document.addEventListener('touchend', onUp);
        }
        handle.addEventListener('mousedown', function(ev){ ev.preventDefault(); ev.stopPropagation(); startResize(ev.clientX, ev.clientY); });
        handle.addEventListener('touchstart', function(ev){ if(ev.touches.length!==1) return; ev.preventDefault(); ev.stopPropagation(); startResize(ev.touches[0].clientX, ev.touches[0].clientY); }, {passive:false});
        container.appendChild(handle);
      });
    })();

    /* ── Zoom buttons (+/−/reset) ────────────────────────────────────────── */
    var MAX_ZOOM = 1000;
    var zoomBtnStyle = 'width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:rgba(6,15,30,0.88);border:1px solid rgba(74,158,255,0.25);color:#c8d8f0;font-size:1rem;cursor:pointer;transition:background 0.15s,border-color 0.15s;font-family:sans-serif;line-height:1;padding:0;';
    var zoomWrap = document.createElement('div');
    zoomWrap.style.cssText = 'position:absolute;bottom:10px;right:10px;z-index:12;display:flex;flex-direction:column;gap:3px;';
    function makeZBtn(label, fn) {
      var b = document.createElement('button');
      b.textContent = label; b.style.cssText = zoomBtnStyle;
      b.title = label === '+' ? 'Zoom in' : label === '−' ? 'Zoom out' : 'Reset view';
      b.addEventListener('mouseover', function(){ this.style.background='rgba(74,158,255,0.18)'; this.style.borderColor='rgba(74,158,255,0.5)'; });
      b.addEventListener('mouseout',  function(){ this.style.background='rgba(6,15,30,0.88)';    this.style.borderColor='rgba(74,158,255,0.25)'; });
      b.addEventListener('click', fn);
      return b;
    }
    zoomWrap.appendChild(makeZBtn('+', function(){ scaleK = Math.min(MAX_ZOOM, scaleK * 1.4); proj.scale(scaleBase * scaleK); redraw(); }));
    zoomWrap.appendChild(makeZBtn('−', function(){ scaleK = Math.max(0.35, scaleK / 1.4); proj.scale(scaleBase * scaleK); redraw(); }));
    zoomWrap.appendChild(makeZBtn('⊙', function(){ scaleK = 1; rot = [10,-25,0]; proj.rotate(rot).scale(scaleBase * scaleK); redraw(); }));
    container.appendChild(zoomWrap);

    /* ── Wheel zoom ──────────────────────────────────────────────────────── */
    svgEl.addEventListener('wheel', function(ev) {
      ev.preventDefault();
      scaleK = Math.max(0.35, Math.min(MAX_ZOOM, scaleK * (ev.deltaY < 0 ? 1.12 : 0.9)));
      proj.scale(scaleBase * scaleK);
      redraw();
    }, {passive: false});

    /* ── Pinch zoom ──────────────────────────────────────────────────────── */
    var _pinchDist = null;
    svgEl.addEventListener('touchstart', function(ev) {
      if (ev.touches.length === 2) {
        ev.preventDefault();
        var dx = ev.touches[0].clientX - ev.touches[1].clientX;
        var dy = ev.touches[0].clientY - ev.touches[1].clientY;
        _pinchDist = Math.sqrt(dx*dx + dy*dy);
      }
    }, {passive: false});
    svgEl.addEventListener('touchmove', function(ev) {
      if (ev.touches.length !== 2 || !_pinchDist) return;
      ev.preventDefault();
      var dx = ev.touches[0].clientX - ev.touches[1].clientX;
      var dy = ev.touches[0].clientY - ev.touches[1].clientY;
      var d = Math.sqrt(dx*dx + dy*dy);
      scaleK = Math.max(0.35, Math.min(MAX_ZOOM, scaleK * d / _pinchDist));
      _pinchDist = d;
      proj.scale(scaleBase * scaleK);
      redraw();
    }, {passive: false});
    svgEl.addEventListener('touchend', function(){ _pinchDist = null; }, {passive: true});

    /* ── Resize ──────────────────────────────────────────────────────────── */
    var _ro = window.ResizeObserver ? new ResizeObserver(function() {
      var nW = container.offsetWidth, nH = container.offsetHeight;
      if (Math.abs(nW - W) < 4 && Math.abs(nH - H) < 4) return;
      W = nW; H = nH;
      scaleBase = Math.min(H / 2.05, (W - 6) / 2);
      proj.scale(scaleBase * scaleK).translate([W/2, H/2]);
      svgEl.setAttribute('height', H);
      redraw();
    }) : null;
    if (_ro) _ro.observe(container);

    /* ── Tooltip helpers ─────────────────────────────────────────────────── */
    function showTip(ev, html) {
      tooltip.innerHTML = html;
      tooltip.style.display = 'block';
      moveTip(ev);
    }
    function moveTip(ev) {
      var x = ev.clientX + 14, y = ev.clientY - 10;
      var tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
      if (x + tw > window.innerWidth - 8) x = ev.clientX - tw - 14;
      if (y + th > window.innerHeight - 8) y = ev.clientY - th - 4;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    }
    function hideTip() { tooltip.style.display = 'none'; }
    svgEl.addEventListener('mouseleave', hideTip);

    /* ── Station info panel (Google Maps data on click) ─────────────────── */
    var stationPanel = document.createElement('div');
    stationPanel.style.cssText = 'position:absolute;bottom:48px;left:8px;width:230px;background:rgba(4,10,22,0.97);border:1px solid rgba(74,158,255,0.35);border-radius:8px;overflow:hidden;z-index:30;display:none;font-family:"DM Sans",sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.7);';
    container.appendChild(stationPanel);

    function hidePanel() { stationPanel.style.display = 'none'; }

    function renderPanel(s, gmaps) {
      var photoHtml = '';
      if (gmaps && gmaps.found && gmaps.photoRef) {
        var proxyUrl = '/.netlify/functions/places?photo=' + encodeURIComponent(gmaps.photoRef);
        photoHtml = '<div style="height:120px;background:#050e1e;overflow:hidden;position:relative;">'
          + '<img src="' + proxyUrl + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.parentNode.style.display=\'none\'">'
          + '</div>';
      }

      var ratingHtml = '';
      if (gmaps && gmaps.found && gmaps.rating) {
        ratingHtml = '<div style="display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap;">'
          + '<span style="color:#fbbf24;font-size:0.8rem;letter-spacing:-0.5px;">' + _stars(gmaps.rating) + '</span>'
          + '<span style="color:rgba(200,220,255,0.7);font-size:0.78rem;">' + gmaps.rating.toFixed(1) + '</span>'
          + '<span style="color:rgba(160,190,230,0.4);font-size:0.75rem;">· ' + (gmaps.reviewCount || 0).toLocaleString() + ' reviews</span>'
          + '</div>';
      }

      var lastReviewHtml = '';
      if (gmaps && gmaps.found && gmaps.lastReviewDate) {
        var ago = _timeAgo(gmaps.lastReviewDate);
        if (ago) lastReviewHtml = '<div style="color:rgba(150,180,220,0.45);font-size:0.72rem;margin-top:3px;">Last reviewed ' + ago + '</div>';
      }

      var showerHtml = '';
      if (gmaps && gmaps.found && gmaps.hasShower === true) {
        showerHtml = '<div style="margin-top:6px;display:inline-flex;align-items:center;gap:4px;background:rgba(0,180,120,0.12);border:1px solid rgba(0,200,120,0.2);border-radius:4px;padding:2px 7px;font-size:0.72rem;color:#4ade80;">🚿 Showers</div>';
      }

      var loadingHtml = (!gmaps) ? '<div style="color:rgba(150,180,220,0.4);font-size:0.72rem;margin-top:6px;">Loading Google Maps data…</div>' : '';
      var noDataHtml  = (gmaps && !gmaps.found) ? '<div style="color:rgba(150,180,220,0.3);font-size:0.72rem;margin-top:6px;">No Google Maps listing found</div>' : '';

      stationPanel.innerHTML = photoHtml
        + '<div style="padding:10px 12px 12px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;">'
        +   '<div><div style="font-family:\'Barlow Condensed\',sans-serif;font-size:1rem;font-weight:700;color:' + s.color + ';line-height:1.2;">' + s.name + '</div>'
        +   '<div style="color:rgba(180,200,255,0.45);font-size:0.72rem;letter-spacing:0.07em;text-transform:uppercase;margin-top:2px;">' + s.op + '</div></div>'
        +   '<button onclick="this.closest(\'[style*=z-index:30]\').style.display=\'none\'" style="background:none;border:none;color:rgba(140,170,210,0.5);font-size:1rem;cursor:pointer;padding:0 0 0 6px;line-height:1;margin-top:-2px;" title="Close">✕</button>'
        + '</div>'
        + '<div style="color:rgba(200,220,255,0.55);font-size:0.78rem;margin-top:5px;">' + s.kw + ' kW · ' + s.units + ' units · ' + s.con + '</div>'
        + ratingHtml + lastReviewHtml + showerHtml + loadingHtml + noDataHtml
        + '</div>';
    }

    function showStationPanel(s) {
      renderPanel(s, null);
      stationPanel.style.display = 'block';

      var cacheKey = s.lat + ',' + s.lng;
      if (_placesCache[cacheKey]) {
        renderPanel(s, _placesCache[cacheKey]);
        return;
      }

      var url = '/.netlify/functions/places?lat=' + s.lat + '&lng=' + s.lng + '&name=' + encodeURIComponent(s.name);
      fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          _placesCache[cacheKey] = data;
          if (stationPanel.style.display !== 'none') renderPanel(s, data);
        })
        .catch(function() {
          _placesCache[cacheKey] = { found: false };
          if (stationPanel.style.display !== 'none') renderPanel(s, { found: false });
        });
    }

    function buildChargingTip(s) {
      return '<div style="font-family:Barlow Condensed,sans-serif;font-size:1rem;font-weight:700;color:' + s.color + ';margin-bottom:3px;">' + s.name + '</div>'
        + '<div style="color:rgba(180,200,255,0.55);font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:5px;">' + s.op + '</div>'
        + '<div style="color:rgba(200,220,255,0.8);font-size:0.85rem;">' + s.kw + ' kW · ' + s.units + ' units · ' + s.con + '</div>'
        + (s.note ? '<div style="color:rgba(200,220,255,0.5);font-size:0.8rem;margin-top:3px;">' + s.note + '</div>' : '')
        + '<div style="color:rgba(74,158,255,0.55);font-size:0.75rem;margin-top:4px;">Click for photos &amp; reviews ↓</div>';
    }
    function buildSiteTip(s, col) {
      return '<div style="font-family:Barlow Condensed,sans-serif;font-size:1rem;font-weight:700;color:' + col + ';margin-bottom:3px;">' + s.n + '</div>'
        + '<div style="color:rgba(180,200,255,0.55);font-size:0.78rem;margin-bottom:4px;">' + s.r + '</div>'
        + (s.a ? '<div style="font-size:0.82rem;color:rgba(200,220,255,0.7);">📍 ' + s.a + '</div>' : '')
        + (s.p ? '<div style="font-size:0.82rem;color:rgba(200,220,255,0.7);">📞 ' + s.p + '</div>' : '')
        + (s.h ? '<div style="font-size:0.82rem;color:rgba(180,200,255,0.45);margin-top:2px;">🕐 ' + s.h + '</div>' : '')
        + (opts.onDotClick ? '<div style="color:rgba(74,158,255,0.55);font-size:0.75rem;margin-top:4px;">Click to view ↓</div>' : '');
    }

    redraw();

    /* ── Public API ──────────────────────────────────────────────────────── */
    return {
      drawCircle: function(lat, lng, radiusKm, color) {
        circleLayer.selectAll('*').remove();
        var deg = radiusKm / 111.32;
        var circlePoly = d3.geoCircle().center([lng, lat]).radius(deg)();
        var strokeColor = color ? color.replace('0.15)', '0.8)').replace('0.12)', '0.8)') : '#4a9eff';
        circleLayer.append('path')
          .datum(circlePoly)
          .attr('fill', color || 'rgba(74,158,255,0.12)')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '6 4')
          .attr('d', pathFn);
        // Center dot (data-lng/lat used by redraw)
        var xy = proj([lng, lat]);
        var vis = xy && isVisible(lng, lat);
        circleLayer.append('circle')
          .attr('data-lng', lng).attr('data-lat', lat)
          .attr('cx', xy ? xy[0] : -999).attr('cy', xy ? xy[1] : -999)
          .attr('r', 5)
          .attr('fill', strokeColor)
          .attr('stroke', 'rgba(255,255,255,0.8)').attr('stroke-width', 1)
          .attr('display', vis ? null : 'none');
      },
      clearCircle: function() {
        circleLayer.selectAll('*').remove();
      },
      rotateTo: function(lat, lng, duration) {
        var targetRot = [-lng, -lat, 0];
        var startRot = rot.slice();
        d3.transition().duration(duration || 700).tween('rotate', function() {
          var ir = d3.interpolate(startRot, targetRot);
          return function(t) {
            rot = ir(t);
            proj.rotate(rot);
            redraw();
          };
        });
      },
      drawRoute: function(geojsonFeature, color) {
        drivingRouteLayer.selectAll('*').remove();
        if (!geojsonFeature) return;
        var col = color || '#34d399';
        drivingRouteLayer.append('path')
          .datum(geojsonFeature)
          .attr('fill', 'none')
          .attr('stroke', col)
          .attr('stroke-width', 3)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .attr('opacity', 0.9)
          .attr('d', pathFn);
      },
      clearRoute: function() {
        drivingRouteLayer.selectAll('*').remove();
      },
      toggleLayer: function(id, active) {
        if (active) activeLayers.add(id);
        else activeLayers.delete(id);
        applyLayerVisibility();
        // Sync layer bar button if present
        var btn = bar.querySelector('[data-layer="' + id + '"]');
        if (btn) { btn.style.opacity = active ? '1' : '0.3'; btn.style.background = active ? 'rgba(255,255,255,0.06)' : 'none'; }
      }
    };
  }

  /* ─── Flat 2-D map (Natural Earth projection + d3.zoom) ──────────────── */
  function buildFlatMap(svgEl, container, world, availLayers, activeLayers, bar, tooltip, opts) {
    bar._setSvg(svgEl);

    var W = container.offsetWidth || 800;

    var svg = d3.select(svgEl);

    // Fit by width so there's no dead space top/bottom; derive exact pixel height from bounds
    function fitByWidth(w) {
      var p = d3.geoNaturalEarth1().fitWidth(w, {type: 'Sphere'});
      var b = d3.geoPath().projection(p).bounds({type: 'Sphere'});
      var h = Math.ceil(b[1][1] - b[0][1]);
      // Shift translate so map top is at y=0
      var t = p.translate();
      p.translate([t[0], t[1] - b[0][1]]);
      return {proj: p, h: h};
    }

    var fit = fitByWidth(W);
    var proj = fit.proj;
    var H = fit.h;
    svgEl.setAttribute('height', H);
    container.style.height = H + 'px';

    var pathFn = d3.geoPath().projection(proj);

    // Root group — zoom/pan transforms are applied here
    var root = svg.append('g');

    // Ocean background (oversized so it covers during pan)
    root.append('rect')
      .attr('x', -W * 3).attr('y', -H * 3)
      .attr('width', W * 7).attr('height', H * 7)
      .attr('fill', '#040c1a');

    // Graticule
    root.append('path')
      .datum(d3.geoGraticule()())
      .attr('fill', 'none')
      .attr('stroke', 'rgba(74,158,255,0.06)')
      .attr('stroke-width', 0.4)
      .attr('d', pathFn);

    // Land
    root.append('path')
      .datum(topojson.feature(world, world.objects.countries))
      .attr('fill', '#0f2340').attr('stroke', '#1d4a6e').attr('stroke-width', 0.5)
      .attr('d', pathFn);

    // Country name labels
    var countryNameLayer = root.append('g').attr('class', 'wg-country-names');
    topojson.feature(world, world.objects.countries).features.forEach(function(feat) {
      var name = COUNTRY_NAMES[+feat.id];
      if (!name) return;
      var c = d3.geoCentroid(feat);
      if (!c || isNaN(c[0]) || isNaN(c[1])) return;
      var xy = proj(c);
      if (!xy) return;
      countryNameLayer.append('text')
        .attr('x', xy[0]).attr('y', xy[1])
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(180,210,255,0.45)')
        .attr('font-size', 7.5)
        .attr('font-family', 'Barlow Condensed,sans-serif')
        .attr('font-weight', 400)
        .attr('letter-spacing', '0.06em')
        .attr('pointer-events', 'none')
        .text(name);
    });

    var ptLayer     = root.append('g').attr('class', 'wg-points');
    var circleLayer = root.append('g').attr('class', 'wg-circle');

    // ── Point layers ────────────────────────────────────────────────────────
    var mcsDots = ptLayer.append('g').attr('class', 'wg-layer-mcs');
    CHARGING.filter(function(s){ return s.con && s.con.indexOf('MCS') !== -1; }).forEach(function(s) {
      var xy = proj([s.lng, s.lat]);
      if (!xy) return;
      mcsDots.append('circle')
        .datum(s)
        .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 5)
        .attr('fill', '#f59e0b').attr('stroke', 'rgba(255,255,255,0.7)').attr('stroke-width', 0.8)
        .style('cursor', 'pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildChargingTip(d)); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); showStationPanel(d); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    var ccsDots = ptLayer.append('g').attr('class', 'wg-layer-ccs');
    CHARGING.filter(function(s){ return s.con && s.con.indexOf('CCS') !== -1; }).forEach(function(s) {
      var xy = proj([s.lng, s.lat]);
      if (!xy) return;
      ccsDots.append('circle')
        .datum(s)
        .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 4.5)
        .attr('fill', '#60a5fa').attr('stroke', 'rgba(255,255,255,0.7)').attr('stroke-width', 0.8)
        .style('cursor', 'pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildChargingTip(d)); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); showStationPanel(d); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    var serviceDots = ptLayer.append('g').attr('class', 'wg-layer-service');
    SERVICE.forEach(function(s) {
      var xy = proj([s.lng != null ? s.lng : s.lon, s.lat]);
      if (!xy) return;
      serviceDots.append('circle')
        .datum(s)
        .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 4)
        .attr('fill', '#4affb0').attr('stroke', 'rgba(255,255,255,0.6)').attr('stroke-width', 0.7)
        .style('cursor', 'pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildSiteTip(d, '#4affb0')); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    var partsDots = ptLayer.append('g').attr('class', 'wg-layer-parts');
    PARTS.forEach(function(s) {
      var xy = proj([s.lng != null ? s.lng : s.lon, s.lat]);
      if (!xy) return;
      partsDots.append('circle')
        .datum(s)
        .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 4)
        .attr('fill', '#b07aff').attr('stroke', 'rgba(255,255,255,0.6)').attr('stroke-width', 0.7)
        .style('cursor', 'pointer')
        .on('mousemove', function(ev, d) { showTip(ev, buildSiteTip(d, '#b07aff')); })
        .on('mouseleave', function() { hideTip(); })
        .on('click', function(ev, d) { hideTip(); if (typeof opts.onDotClick === 'function') opts.onDotClick(d); });
    });

    // ── Location count badge ────────────────────────────────────────────────
    var countEl;
    if (opts.showLayerBar !== false) {
      countEl = document.createElement('span');
      countEl.style.cssText = 'font-family:"DM Sans",sans-serif;font-size:0.75rem;color:rgba(200,216,240,0.5);padding:0 2px 0 8px;white-space:nowrap;align-self:center;border-left:1px solid rgba(74,158,255,0.18);margin-left:4px;';
      bar.appendChild(countEl);
    } else {
      countEl = document.createElement('div');
      countEl.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:10;padding:4px 14px;background:rgba(6,15,30,0.9);border:1px solid rgba(74,158,255,0.2);border-radius:20px;backdrop-filter:blur(6px);font-family:"DM Sans",sans-serif;font-size:0.75rem;color:rgba(200,216,240,0.65);white-space:nowrap;pointer-events:none;';
      container.appendChild(countEl);
    }
    function updateLocationCount() {
      var hasMcs = activeLayers.has('mcs'), hasCcs = activeLayers.has('ccs');
      var hasSvc = activeLayers.has('service'), hasPrt = activeLayers.has('parts');
      var n = 0;
      if (hasMcs || hasCcs) n += CHARGING.filter(function(s){
        return (hasMcs && s.con && s.con.indexOf('MCS') !== -1) ||
               (hasCcs && s.con && s.con.indexOf('CCS') !== -1);
      }).length;
      if (hasSvc || hasPrt) n += SITES_ALL.filter(function(s){
        return (hasSvc && (!s.c || s.dealer)) || (hasPrt && (!!s.c || s.dealer));
      }).length;
      countEl.textContent = n ? n + ' locations' : '';
    }
    updateLocationCount();
    svgEl.addEventListener('layertoggle', updateLocationCount);

    // ── Layer visibility ─────────────────────────────────────────────────────
    function applyLayerVisibility() {
      mcsDots.style('display',     activeLayers.has('mcs')     ? null : 'none');
      ccsDots.style('display',     activeLayers.has('ccs')     ? null : 'none');
      serviceDots.style('display', activeLayers.has('service') ? null : 'none');
      partsDots.style('display',   activeLayers.has('parts')   ? null : 'none');
    }
    applyLayerVisibility();
    svgEl.addEventListener('layertoggle', function() { applyLayerVisibility(); });

    // ── Tooltip helpers ──────────────────────────────────────────────────────
    function showTip(ev, html) {
      tooltip.innerHTML = html;
      tooltip.style.display = 'block';
      moveTip(ev);
    }
    function moveTip(ev) {
      var x = ev.clientX + 14, y = ev.clientY - 10;
      var tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
      if (x + tw > window.innerWidth - 8) x = ev.clientX - tw - 14;
      if (y + th > window.innerHeight - 8) y = ev.clientY - th - 4;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    }
    function hideTip() { tooltip.style.display = 'none'; }
    svgEl.addEventListener('mouseleave', hideTip);

    // ── Station info panel (Google Maps data on click) ───────────────────────
    var stationPanel = document.createElement('div');
    stationPanel.style.cssText = 'position:absolute;bottom:48px;left:8px;width:230px;background:rgba(4,10,22,0.97);border:1px solid rgba(74,158,255,0.35);border-radius:8px;overflow:hidden;z-index:30;display:none;font-family:"DM Sans",sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.7);';
    container.appendChild(stationPanel);

    function renderPanel(s, gmaps) {
      var photoHtml = '';
      if (gmaps && gmaps.found && gmaps.photoRef) {
        var proxyUrl = '/.netlify/functions/places?photo=' + encodeURIComponent(gmaps.photoRef);
        photoHtml = '<div style="height:120px;background:#050e1e;overflow:hidden;position:relative;">'
          + '<img src="' + proxyUrl + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.parentNode.style.display=\'none\'">'
          + '</div>';
      }
      var ratingHtml = '';
      if (gmaps && gmaps.found && gmaps.rating) {
        ratingHtml = '<div style="display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap;">'
          + '<span style="color:#fbbf24;font-size:0.8rem;letter-spacing:-0.5px;">' + _stars(gmaps.rating) + '</span>'
          + '<span style="color:rgba(200,220,255,0.7);font-size:0.78rem;">' + gmaps.rating.toFixed(1) + '</span>'
          + '<span style="color:rgba(160,190,230,0.4);font-size:0.75rem;">· ' + (gmaps.reviewCount || 0).toLocaleString() + ' reviews</span>'
          + '</div>';
      }
      var lastReviewHtml = '';
      if (gmaps && gmaps.found && gmaps.lastReviewDate) {
        var ago = _timeAgo(gmaps.lastReviewDate);
        if (ago) lastReviewHtml = '<div style="color:rgba(150,180,220,0.45);font-size:0.72rem;margin-top:3px;">Last reviewed ' + ago + '</div>';
      }
      var showerHtml = '';
      if (gmaps && gmaps.found && gmaps.hasShower === true) {
        showerHtml = '<div style="margin-top:6px;display:inline-flex;align-items:center;gap:4px;background:rgba(0,180,120,0.12);border:1px solid rgba(0,200,120,0.2);border-radius:4px;padding:2px 7px;font-size:0.72rem;color:#4ade80;">🚿 Showers</div>';
      }
      var loadingHtml = (!gmaps) ? '<div style="color:rgba(150,180,220,0.4);font-size:0.72rem;margin-top:6px;">Loading Google Maps data…</div>' : '';
      var noDataHtml  = (gmaps && !gmaps.found) ? '<div style="color:rgba(150,180,220,0.3);font-size:0.72rem;margin-top:6px;">No Google Maps listing found</div>' : '';
      stationPanel.innerHTML = photoHtml
        + '<div style="padding:10px 12px 12px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;">'
        +   '<div><div style="font-family:\'Barlow Condensed\',sans-serif;font-size:1rem;font-weight:700;color:' + s.color + ';line-height:1.2;">' + s.name + '</div>'
        +   '<div style="color:rgba(180,200,255,0.45);font-size:0.72rem;letter-spacing:0.07em;text-transform:uppercase;margin-top:2px;">' + s.op + '</div></div>'
        +   '<button onclick="this.closest(\'[style*=z-index:30]\').style.display=\'none\'" style="background:none;border:none;color:rgba(140,170,210,0.5);font-size:1rem;cursor:pointer;padding:0 0 0 6px;line-height:1;margin-top:-2px;" title="Close">✕</button>'
        + '</div>'
        + '<div style="color:rgba(200,220,255,0.55);font-size:0.78rem;margin-top:5px;">' + s.kw + ' kW · ' + s.units + ' units · ' + s.con + '</div>'
        + ratingHtml + lastReviewHtml + showerHtml + loadingHtml + noDataHtml
        + '</div>';
    }

    function showStationPanel(s) {
      renderPanel(s, null);
      stationPanel.style.display = 'block';
      var cacheKey = s.lat + ',' + s.lng;
      if (_placesCache[cacheKey]) { renderPanel(s, _placesCache[cacheKey]); return; }
      var url = '/.netlify/functions/places?lat=' + s.lat + '&lng=' + s.lng + '&name=' + encodeURIComponent(s.name);
      fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) { _placesCache[cacheKey] = data; if (stationPanel.style.display !== 'none') renderPanel(s, data); })
        .catch(function() { _placesCache[cacheKey] = {found:false}; if (stationPanel.style.display !== 'none') renderPanel(s, {found:false}); });
    }

    function buildChargingTip(s) {
      return '<div style="font-family:Barlow Condensed,sans-serif;font-size:1rem;font-weight:700;color:' + s.color + ';margin-bottom:3px;">' + s.name + '</div>'
        + '<div style="color:rgba(180,200,255,0.55);font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:5px;">' + s.op + '</div>'
        + '<div style="color:rgba(200,220,255,0.8);font-size:0.85rem;">' + s.kw + ' kW · ' + s.units + ' units · ' + s.con + '</div>'
        + (s.note ? '<div style="color:rgba(200,220,255,0.5);font-size:0.8rem;margin-top:3px;">' + s.note + '</div>' : '')
        + '<div style="color:rgba(74,158,255,0.55);font-size:0.75rem;margin-top:4px;">Click for photos &amp; reviews ↓</div>';
    }
    function buildSiteTip(s, col) {
      return '<div style="font-family:Barlow Condensed,sans-serif;font-size:1rem;font-weight:700;color:' + col + ';margin-bottom:3px;">' + s.n + '</div>'
        + '<div style="color:rgba(180,200,255,0.55);font-size:0.78rem;margin-bottom:4px;">' + s.r + '</div>'
        + (s.a ? '<div style="font-size:0.82rem;color:rgba(200,220,255,0.7);">📍 ' + s.a + '</div>' : '')
        + (s.p ? '<div style="font-size:0.82rem;color:rgba(200,220,255,0.7);">📞 ' + s.p + '</div>' : '')
        + (s.h ? '<div style="font-size:0.82rem;color:rgba(180,200,255,0.45);margin-top:2px;">🕐 ' + s.h + '</div>' : '')
        + (opts.onDotClick ? '<div style="color:rgba(74,158,255,0.55);font-size:0.75rem;margin-top:4px;">Click to view ↓</div>' : '');
    }

    // ── d3.zoom (pan + scroll zoom + pinch) ──────────────────────────────────
    // Store base radius and stroke-width on each dot so we can scale inversely with zoom
    ptLayer.selectAll('circle').each(function() {
      var sel = d3.select(this);
      this.__baseR  = +sel.attr('r');
      this.__baseSW = +(sel.attr('stroke-width') || 0.7);
    });
    function scaleDots(k) {
      ptLayer.selectAll('circle')
        .attr('r', function() { return this.__baseR / k; })
        .attr('stroke-width', function() { return this.__baseSW / k; });
    }
    var zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 20])
      .on('start', function() { svg.style('cursor', 'grabbing'); hideTip(); })
      .on('zoom', function(ev) { root.attr('transform', ev.transform); scaleDots(ev.transform.k); })
      .on('end', function() { svg.style('cursor', 'grab'); });
    svg.call(zoomBehavior);

    // ── Zoom buttons (+/−/reset) ─────────────────────────────────────────────
    var zoomBtnStyle = 'width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:rgba(6,15,30,0.88);border:1px solid rgba(74,158,255,0.25);color:#c8d8f0;font-size:1rem;cursor:pointer;transition:background 0.15s,border-color 0.15s;font-family:sans-serif;line-height:1;padding:0;';
    var zoomWrap = document.createElement('div');
    zoomWrap.style.cssText = 'position:absolute;bottom:10px;right:10px;z-index:12;display:flex;flex-direction:column;gap:3px;';
    function makeZBtn(label, fn) {
      var b = document.createElement('button');
      b.textContent = label; b.style.cssText = zoomBtnStyle;
      b.title = label === '+' ? 'Zoom in' : label === '−' ? 'Zoom out' : 'Reset view';
      b.addEventListener('mouseover', function(){ this.style.background='rgba(74,158,255,0.18)'; this.style.borderColor='rgba(74,158,255,0.5)'; });
      b.addEventListener('mouseout',  function(){ this.style.background='rgba(6,15,30,0.88)';    this.style.borderColor='rgba(74,158,255,0.25)'; });
      b.addEventListener('click', fn);
      return b;
    }
    zoomWrap.appendChild(makeZBtn('+', function(){ svg.transition().duration(250).call(zoomBehavior.scaleBy, 1.4); }));
    zoomWrap.appendChild(makeZBtn('−', function(){ svg.transition().duration(250).call(zoomBehavior.scaleBy, 1/1.4); }));
    zoomWrap.appendChild(makeZBtn('⊙', function(){ svg.transition().duration(350).call(zoomBehavior.transform, d3.zoomIdentity); }));
    container.appendChild(zoomWrap);

    // ── ResizeObserver ───────────────────────────────────────────────────────
    var _ro = window.ResizeObserver ? new ResizeObserver(function() {
      var nW = container.offsetWidth;
      if (Math.abs(nW - W) < 4) return;
      W = nW;
      var reFit = fitByWidth(W);
      var sc = reFit.proj.scale(), tr = reFit.proj.translate();
      proj.scale(sc).translate(tr);
      H = reFit.h;
      svgEl.setAttribute('height', H);
      container.style.height = H + 'px';
      // Re-draw fixed paths
      root.selectAll('path').each(function(d) {
        if (d) d3.select(this).attr('d', pathFn(d) || '');
      });
      // Re-position dots
      ptLayer.selectAll('circle').each(function(d) {
        if (!d) return;
        var lon = d.lng != null ? d.lng : d.lon;
        var xy = proj([lon, d.lat]);
        if (xy) d3.select(this).attr('cx', xy[0]).attr('cy', xy[1]);
      });
      // Reset zoom so map fills container again
      svg.call(zoomBehavior.transform, d3.zoomIdentity);
    }) : null;
    if (_ro) _ro.observe(container);

    // ── Public API ───────────────────────────────────────────────────────────
    return {
      drawCircle: function(lat, lng, radiusKm, color) {
        circleLayer.selectAll('*').remove();
        var deg = radiusKm / 111.32;
        var circlePoly = d3.geoCircle().center([lng, lat]).radius(deg)();
        var strokeColor = color ? color.replace('0.15)', '0.8)').replace('0.12)', '0.8)') : '#4a9eff';
        circleLayer.append('path')
          .datum(circlePoly)
          .attr('fill', color || 'rgba(74,158,255,0.15)')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '6 4')
          .attr('d', pathFn);
      },
      clearCircle: function() { circleLayer.selectAll('*').remove(); },
      rotateTo: function(lat, lng, duration) {
        var xy = proj([lng, lat]);
        if (!xy) return;
        var tx = W / 2 - xy[0];
        var ty = H / 2 - xy[1];
        svg.transition().duration(duration || 700)
          .call(zoomBehavior.transform, d3.zoomIdentity.translate(tx, ty));
      },
      drawRoute: function() {},
      clearRoute: function() {},
      toggleLayer: function(id, active) {
        if (active) activeLayers.add(id);
        else activeLayers.delete(id);
        applyLayerVisibility();
        var btn = bar.querySelector('[data-layer="' + id + '"]');
        if (btn) { btn.style.opacity = active ? '1' : '0.3'; btn.style.background = active ? 'rgba(255,255,255,0.06)' : 'none'; }
      }
    };
  }

})();
