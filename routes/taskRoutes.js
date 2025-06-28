const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markComplete,
  getDashboard,
} = require('../controllers/taskController');
const { protect } = require('../middeware/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.patch('/:id/complete', protect, markComplete);

module.exports = router;
