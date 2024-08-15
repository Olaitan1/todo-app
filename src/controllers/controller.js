const express = require('express');
const Task = require('../model/task')
const History = require('../model/history')
// var moment = require('moment');
const cron = require('node-cron')


const AddTask = async (req, res) => {
  const { name, priority, description, dueDate, reminder, status } = req.body;

  const newTask = new Task({
    name,
    priority,
    description,
    dueDate,
    reminder,
    status,
  });

  try {
    await newTask.save();

    res.status(201).json({
      message: "Task added successfully",
      newTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding task",
      error,
    });
  }
};


const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name, priority, description, dueDate, reminder, status } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (name) task.name = name;
    if (priority) task.priority = priority;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (reminder) task.reminder = reminder;
    if (status) task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error,
    });
  }
};


const SingleTask = async (req, res) =>
{
  try
  {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
 

    if (!task) {
      return res.status(404).json({ message: "Task not found" }); 
    }
    return res.status(200).json(task);
  } catch (error)
  {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) =>
{
  try
  {
    const { taskId } = req.params
    const task = await Task.findByIdAndDelete(taskId);
    if (!task)
    {
      return res.status(404).json({ message: "Task not found" })
    }
    return res.status(200).json({message:"Task deleted successfully"});
  } catch (error)
  {
    console.log(error)
    return res.status(500).json({ message: "Server error" });

  }
};

const HistoryTasks = async (req, res) => {
  try {
    const statusQuery = req.query.status;

    let tasks;
    if (statusQuery) {
      tasks = await History.find({ status: statusQuery });
    } else {
      tasks = await History.find();
    }

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// const allTasks = async (req, res) => {
//   try {
//     const statusQuery = req.query.status;

//     let tasks;
//     if (statusQuery) {
//       // If status query is provided, filter tasks by status
//       tasks = await Task.find({ status: statusQuery });
//     } else {
//       // Otherwise, retrieve all tasks
//       tasks = await Task.find();
//     }

//     res.status(200).json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Error retrieving tasks:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };


const allTasks = async (req, res) =>
{
  try {
    const { status, priority } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

cron.schedule('0 0 * * *', async () =>
{
    const currentDate = new Date()
    // const existingTask = await Task.find()
    const expiredTask = await Task.find({ dueDate: { $lt: currentDate } });
    console.log(expiredTask)
    for (const task of expiredTask)
    {
        if (expiredTask.status === 'pending')
        {
            const completedTask = new History({
                description: task.description,
                completedAt: currentDate
            });
            await completedTask.save();
            await Task.findByIdAndDelete(task._id)
        }
    }
})

module.exports = {AddTask,updateTask, allTasks, SingleTask, deleteTask, HistoryTasks}
