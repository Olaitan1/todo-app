const mongoose = require('mongoose');
const historySchema = new mongoose.Schema({
    description: String,
    completedAt: Date
});
const History = mongoose.model('History', historySchema);

module.exports = History