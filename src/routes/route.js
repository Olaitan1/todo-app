const router = require('express').Router();
const {
  AddTask,
  updateTask,
  allTasks,
  HistoryTasks,
  SingleTask,
  deleteTask,
} = require("../controllers/controller");
const { protect } = require("../middleware/authorization");


router.post('/add-new-task',protect, AddTask);
router.patch('/edit-task/:taskId',protect, updateTask);
router.delete("/tasks/:taskId", protect, deleteTask);
router.get('/tasks',protect, allTasks);
router.get("/tasks/:taskId",protect, SingleTask);
router.get('/history',protect, HistoryTasks);

module.exports= router