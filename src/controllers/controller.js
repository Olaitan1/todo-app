const Task = require('../model/task')
const User = require('../model/user')
const History = require('../model/history')
const cron = require('node-cron');
const { mailSent } = require("../utils/notification");
const {  FromAdminMail } = require("../config");




const AddTask = async (req, res) => {
  const { name, priority, description, dueDate, reminder, status } = req.body;
  const userId = req.user._id; 
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const newTask = new Task({
    name,
    priority,
    description,
    dueDate,
    reminder,
    status,
    user: userId, 
  });

  try {
    await newTask.save();
const html = `Hello ${user.fullName},\n\nYour have created task: "${newTask.name} at ${newTask.createdAt}". Please ensure to complete it before ${newTask.dueDate} .\n\nBest regards,\nTask Manager`;

// Send email
await mailSent(
  FromAdminMail,
 user.email,
  `New Task: "${newTask.name}" `,
  html
);
    res.status(201).json({
      message: "Task added successfully",
      newTask,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error adding task",
      error,
    });
  }
};



const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name, priority, description, dueDate, reminder, status } = req.body;
  const userId = req.user._id; 

  try {
    // Find the task that belongs to the user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or you're not authorized to update it",
      });
    }

    // Update task fields if they are provided
    if (name) task.name = name;
    if (priority) task.priority = priority;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (reminder) task.reminder = reminder;
    if (status) task.status = status;

    await task.save();

    if (status === "completed") {
     
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const html = `Nice job done! ${user.fullName},\n\nYour task: "${task.name}" has been completed.\n\nBest regards,\nTask Manager`;

      // Send email
      await mailSent(FromAdminMail, user.email, `Kudos!`, html);
    }

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




const SingleTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id; 
  
  try {
    const task = await Task.findOne({ _id: taskId, user: userId }); 
    
    if (!task) {
      return res
        .status(404)
        .json({
          message: "Task not found or you're not authorized to view it",
        });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id; 
  
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId }); 
    
    if (!task) {
      return res
        .status(404)
        .json({
          message: "Task not found or you're not authorized to delete it",
        });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
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


// const allTasks = async (req, res) =>
// {
//   try {
//     const { status, priority } = req.query;

//     let filter = {};
//     if (status) {
//       filter.status = status;
//     }
//     if (priority) {
//       filter.priority = priority;
//     }

//     const tasks = await Task.find(filter);

//     res.status(200).json({
//       success: true,
//       data: tasks,
//     });
//   } catch (error) {
//     console.error("Error retrieving tasks:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

const allTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const userId = req.user._id; 
   
    let filter = { user: userId };
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


// cron.schedule('0 0 * * *', async () =>
// {
//     const currentDate = new Date()
//     // const existingTask = await Task.find()
//     const expiredTask = await Task.find({ dueDate: { $lt: currentDate } });
//     console.log(expiredTask)
//     for (const task of expiredTask)
//     {
//         if (expiredTask.status === 'pending')
//         {
//             const completedTask = new History({
//                 description: task.description,
//                 completedAt: currentDate
//             });
//             await completedTask.save();
//             await Task.findByIdAndDelete(task._id)
//         }
//     }

cron.schedule("0 * * * *", async () => {
    const users = await User.find();

  for (const user of users)
  {
    // Find all pending tasks for this user
    const pendingTasks = await Task.find({ status: "pending", user: user._id });

    for (const task of pendingTasks)
    {
      // Calculate 2/3 of the time between task creation and due date
      const createdAt = new Date(task.createdAt);
      const dueDate = new Date(task.dueDate);
      const timeDifference = dueDate - createdAt; // Time difference in milliseconds
      const notificationTime = createdAt.getTime() + (2 / 3) * timeDifference; // 2/3 of the time span

      // Check if the current date has reached or passed the 2/3 time point
      if (currentDate >= notificationTime && currentDate < dueDate)
      {
        console.log(`Sending reminder for task: ${task.name}, User: ${user._id}`);

        const html = `Hello ${user.fullName},\n\nYour task "${task.name}" will be due by ${task.dueDate}. Please ensure to complete it on time.\n\nBest regards,\nTask Manager`;

        // Send email
        await mailSent(
          FromAdminMail,
          user.email,
          `Reminder: Task "${task.name}" is due soon!`,
          html
        );

        console.log(`Reminder email sent for task: ${task.name}`);
      }
    }
  }
});
cron.schedule("0 * * * *", async () => {
  const currentDate = new Date();
    const users = await User.find();

  for (const user of users)
  {
    // Find tasks that are overdue (dueDate has passed) and are still pending for this specific user
    const overdueTasks = await Task.find({
      dueDate: { $lt: currentDate }, // Due date is less than the current date
      status: "pending", // Only pending tasks
      user: user._id, // Only tasks for the specific user
    });

    for (const task of overdueTasks)
    {
      // Prepare the email content
      const html = `Hello ${user.name},\n\nYour task "${task.name}" was due on ${task.dueDate} and is now overdue. Please ensure to complete it as soon as possible.\n\nBest regards,\nTask Manager`;

   
      // Send email
      await mailSent(
        FromAdminMail,
        user.email,
        `Overdue Task: "${task.name}"`,
        html
      );

      console.log(`Overdue email sent for task: ${task.name}`);
    }
  }
});
module.exports = {AddTask,updateTask, allTasks, SingleTask, deleteTask, HistoryTasks}
  