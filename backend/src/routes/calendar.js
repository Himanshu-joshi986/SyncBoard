const express = require('express');
const router = express.Router();
const { oauth2Client, google } = require('../config/googleClient');

// List upcoming events (simple demo; relies on oauth2Client having credentials in memory)
router.get('/events', async (_req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { data } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });
    res.json(data.items || []);
  } catch (err) {
    console.error('Calendar list error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Minimal endpoint to create a new event/task
router.post('/events', async (req, res) => {
  try {
    const { date, summary } = req.body;
    if (!date || !summary) return res.status(400).json({ error: 'Missing date or summary' });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary,
      start: { date },
      end: { date }
    };
    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    res.json(data);
  } catch (err) {
    console.error('Calendar create error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
