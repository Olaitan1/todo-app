const express = require('express');
const Task = require('../model/task')
const History = require('../model/history')
var moment = require('moment');
const cron = require('node-cron')


const AddTask = async (req, res) =>
{
    const { description, dueDate } = req.body
    const newTask = new Task({
        description,
        dueDate: ('currentdate', moment().format(("YYYY-MM-DD"))),
        status:'pending'
    });
    await newTask.save()

    res.status(201).json({
        message: 'Task added successfully',
        newTask
    })
};

const updateTask = async(req, res) => {

    const {taskId} = req.params
    const task = await Task.findById(taskId)

    if (!task)
    {
      return  res.status(404).json('Not an existing task')
    }
   const completedTask = new History({
                description: task.description,
                completedAt: new Date()
   });
                await completedTask.save();
    await Task.findByIdAndDelete(taskId)
    
    res.status(200).json({
    message:'Task completed'
})
}

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

module.exports = {AddTask,updateTask}
