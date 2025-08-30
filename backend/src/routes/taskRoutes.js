const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const router = express.Router();

// ➡️ Create new task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➡️ Get tasks for a user (with optional date range)
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { from, to } = req.query;

    let query = { email };

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const tasks = await Task.find(query).sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Today’s tasks for a user
router.get("/today/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasks = await Task.find({
      email,
      date: { $gte: today, $lt: tomorrow },
    }).sort({ date: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Get shared tasks (user + friends)
router.get("/shared/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).populate("friends");
    if (!user) return res.status(404).json({ error: "User not found" });

    const emails = [user.email, ...user.friends.map((f) => f.email)];

    const tasks = await Task.find({ email: { $in: emails } }).sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➡️ Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➡️ Overdue tasks for a user
router.get("/overdue/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      email,
      date: { $lt: today },          // older than today
      taskCompletionStatus: false    // still pending
    }).sort({ date: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
