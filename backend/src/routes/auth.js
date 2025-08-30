const express = require("express");
const router = express.Router();
const { oauth2Client } = require("../config/googleClient");
const { google } = require("googleapis");
const User = require("../models/User");

// Google OAuth URL
router.get("/google", (_req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar.readonly"
    ]
  });
  res.json({ url });
});

// Google OAuth callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Missing code" });

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user profile info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    // Save or update user in DB
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        tokens
      });
    } else {
      user.tokens = tokens;
    }
    await user.save();

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Auth callback error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
