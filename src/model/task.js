const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    description: String,
    dueDate: Date,
    status: {
        type: String,
        enum: ['completed', 'pending']
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task