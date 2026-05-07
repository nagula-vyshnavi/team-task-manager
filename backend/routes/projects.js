const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

// CREATE PROJECT
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id]
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL MY PROJECTS
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    }).populate('admin', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE PROJECT
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found!' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD MEMBER (Admin only)
router.post('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found!' });

    // Check if admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can add members!' });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already a member!' });
    }

    project.members.push(user._id);
    await project.save();
    res.json({ message: 'Member added!', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REMOVE MEMBER (Admin only)
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can remove members!' });
    }
    project.members = project.members.filter(
      m => m.toString() !== req.params.userId
    );
    await project.save();
    res.json({ message: 'Member removed!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;