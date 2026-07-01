// Clears the manual session cookie and returns to the login page.
const auth = require('./lib/manualAuth');

exports.handler = async () => ({
  statusCode: 302,
  headers: { Location: '/manual-login.html?signedout=1', 'Set-Cookie': auth.clearCookie(), 'Cache-Control': 'no-store' },
  body: '',
});
