const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// CREATE TASK
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, description, 
      projectId, priority, dueDate 
    } = req.body;

    const task = new Task({
      title,
      description,
      project: projectId,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      createdBy: req.user.id,
      assignedTo: req.user.id
    });

    await task.save();
    res.json(task);

  } catch (err) {
    console.error('CREATE TASK ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET TASKS BY PROJECT
router.get('/project/:projectId', 
  auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      project: req.params.projectId 
    })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY TASKS
router.get('/my', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      assignedTo: req.user.id 
    })
    .populate('project', 'name')
    .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DASHBOARD STATS
router.get('/dashboard/:projectId', 
  auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      project: req.params.projectId 
    });
    const now = new Date();
    res.json({
      total: tasks.length,
      todo: tasks.filter(
        t => t.status === 'To Do').length,
      inProgress: tasks.filter(
        t => t.status === 'In Progress').length,
      done: tasks.filter(
        t => t.status === 'Done').length,
      overdue: tasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < now && 
        t.status !== 'Done'
      ).length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STATUS
router.put('/:id/status', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE TASK
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TASK
router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;