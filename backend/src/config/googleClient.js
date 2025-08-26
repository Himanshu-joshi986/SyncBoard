const { google } = require('googleapis');

// OAuth2 client used by the simple starter (tokens stored in memory for this demo)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // e.g. http://localhost:5000/auth/google/callback
);

module.exports = { oauth2Client, google };
