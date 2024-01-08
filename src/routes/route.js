const router = require('express').Router();
const {AddTask, updateTask} = require('../controllers/controller');


router.post('/add-new-task', AddTask)
router.patch('/edit-task/:taskId', updateTask)
module.exports= router