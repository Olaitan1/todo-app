const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
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
      enum: ["email", "sms"],
    },
    date: Date,
  },
  status: {
      type: String,
      default: "pending",
    enum: ["completed", "pending"],
  },
 
},
{timestamps: true});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
