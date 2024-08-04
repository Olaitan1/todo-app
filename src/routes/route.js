const router = require('express').Router();
const {AddTask, updateTask, allTasks, HistoryTasks} = require('../controllers/controller');
const { protect } = require("../middleware/authorization");


router.post('/add-new-task',protect, AddTask);
router.patch('/edit-task/:taskId', updateTask);
router.get('/tasks', allTasks);
router.get('/history', HistoryTasks);

module.exports= router