const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: String,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    description: String,
    dueDate: Date,
    reminder: {
      method: {
        type: String,
      },
      date: Date,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["completed", "pending"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
