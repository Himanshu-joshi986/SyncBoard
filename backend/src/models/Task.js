const mongoose = require("mongoose");

// Regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper function to normalize date inputs
function parseDate(val) {
  if (!val) return null;

  // If already a Date object
  if (val instanceof Date) return val;

  // If format = dd-mm-yyyy
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (ddmmyyyy.test(val)) {
    const [_, day, month, year] = val.match(ddmmyyyy);
    return new Date(`${year}-${month}-${day}`);
  }

  // If format = yyyy-mm-dd (ISO style)
  const yyyymmdd = /^(\d{4})-(\d{2})-(\d{2})$/;
  if (yyyymmdd.test(val)) {
    return new Date(val);
  }

  // Default: try JS Date parsing
  return new Date(val);
}

const taskSchema = new mongoose.Schema(
  {
    checkbox: { type: Boolean, default: false },

    date: {
      type: Date,
      required: true,
      set: parseDate, // ✅ auto-convert before saving
    },

    task: { type: String, required: true, maxlength: 100 },
    taskPriority: { type: Number, enum: [1, 2, 3], default: 2 },
    taskCompletionStatus: { type: Boolean, default: false },

    email: {
      type: String,
      required: true,
      validate: {
        validator: (val) => emailRegex.test(val),
        message: "Invalid email format",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
