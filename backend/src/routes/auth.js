const express = require('express');
const router = express.Router();
const { oauth2Client } = require('../config/googleClient');

// Return Google auth URL to client
router.get('/google', (_req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar.readonly'
    ]
  });
  res.json({ url });
});

// Callback: exchange code for tokens
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Missing code query parameter' });

    const { tokens } = await oauth2Client.getToken(code);
    // NOTE: in a real app you should persist tokens per-user in your DB
    oauth2Client.setCredentials(tokens);

    res.json({ tokens });
  } catch (err) {
    console.error('Auth callback error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
