const router = require('express').Router();
const {AddTask, updateTask, allTasks, HistoryTasks} = require('../controllers/controller');


router.post('/add-new-task', AddTask);
router.patch('/edit-task/:taskId', updateTask);
router.get('/tasks', allTasks);
router.get('/history', HistoryTasks);

module.exports= router