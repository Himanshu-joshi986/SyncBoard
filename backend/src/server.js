const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Import routes
const authRoutes = require("./routes/auth");
const calendarRoutes = require("./routes/calendar");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ Use routes
app.use("/auth", authRoutes);
app.use("/calendar", calendarRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running successfully!");
});

// ✅ Database Connection + Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
