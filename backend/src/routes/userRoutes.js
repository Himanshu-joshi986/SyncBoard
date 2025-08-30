const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ➡️ Register new user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➡️ Send Friend Request (by email)
router.post("/:email/send-request", async (req, res) => {
  try {
    const { email } = req.params;
    const { friendEmail } = req.body;

    const user = await User.findOne({ email });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found" });
    }

    if (user._id.equals(friend._id)) {
      return res.status(400).json({ error: "You cannot send request to yourself" });
    }

    if (friend.friendRequests.includes(user._id)) {
      return res.status(400).json({ error: "Request already sent" });
    }

    if (friend.friends.includes(user._id)) {
      return res.status(400).json({ error: "Already friends" });
    }

    friend.friendRequests.push(user._id);
    await friend.save();

    res.json({ message: "Friend request sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Accept Friend Request
router.post("/:email/accept-request", async (req, res) => {
  try {
    const { email } = req.params;
    const { requesterEmail } = req.body;

    const user = await User.findOne({ email });
    const requester = await User.findOne({ email: requesterEmail });

    if (!user || !requester) {
      return res.status(404).json({ error: "User or requester not found" });
    }

    if (!user.friendRequests.includes(requester._id)) {
      return res.status(400).json({ error: "No friend request from this user" });
    }

    // Remove from pending
    user.friendRequests = user.friendRequests.filter(
      (id) => !id.equals(requester._id)
    );

    // Add each other as friends
    user.friends.push(requester._id);
    requester.friends.push(user._id);

    await user.save();
    await requester.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Reject Friend Request
router.post("/:email/reject-request", async (req, res) => {
  try {
    const { email } = req.params;
    const { requesterEmail } = req.body;

    const user = await User.findOne({ email });
    const requester = await User.findOne({ email: requesterEmail });

    if (!user || !requester) {
      return res.status(404).json({ error: "User or requester not found" });
    }

    if (!user.friendRequests.includes(requester._id)) {
      return res.status(400).json({ error: "No friend request from this user" });
    }

    // Remove from pending
    user.friendRequests = user.friendRequests.filter(
      (id) => !id.equals(requester._id)
    );

    await user.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Get Pending Friend Requests
router.get("/:email/requests", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).populate("friendRequests", "email name");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Get Friends List
router.get("/:email/friends", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).populate("friends", "email name");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
