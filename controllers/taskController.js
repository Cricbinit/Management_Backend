const Task = require('../models/Task');

const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const task = await Task.create({
    user: req.user.id,
    title,
    description,
    dueDate,
  });
  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task.user.toString() !== req.user.id)
    return res.status(401).json({ message: 'Not authorized' });

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTask);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task.user.toString() !== req.user.id)
    return res.status(401).json({ message: 'Not authorized' });

  await task.remove();
  res.json({ message: 'Task removed' });
};

const markComplete = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task.user.toString() !== req.user.id)
    return res.status(401).json({ message: 'Not authorized' });

  task.status = task.status === 'completed' ? 'pending' : 'completed';
  const updatedTask = await task.save();
  res.json(updatedTask);
};

const getDashboard = async (req, res) => {
  const completed = await Task.countDocuments({ user: req.user.id, status: 'completed' });
  const pending = await Task.countDocuments({ user: req.user.id, status: 'pending' });
  const latestTasks = await Task.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);
  res.json({ completed, pending, latestTasks });
};

module.exports = { getTasks, createTask, updateTask, deleteTask, markComplete, getDashboard };
