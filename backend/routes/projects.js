const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protectClient } = require('../middleware/authClient');

// @route   GET /api/projects/my
// @desc    Get logged-in client's projects
// @access  Private (Client)
router.get('/my', protectClient, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.client._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/projects
// @desc    Get all public projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active, publicOnly } = req.query;
    let query = {};

    // Filter by active status
    if (active !== undefined) {
      query.active = active === 'true';
    }

    // Default to public projects unless specified otherwise (e.g. for admin usage you might want all)
    // For now, let's just return what matches query. If 'publicOnly' is true, filter by isPublic.
    if (publicOnly === 'true') {
      query.isPublic = true;
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const {
      title, description, imageUrl, technologies, order, active,
      client, progress, status, startDate, endDate, isPublic, documents
    } = req.body;

    const project = new Project({
      title,
      description,
      imageUrl,
      technologies: technologies || [],
      order: order || 0,
      active: active !== undefined ? active : true,
      client: client || null,
      progress: progress || 0,
      status: status || 'Planning',
      startDate,
      endDate,
      isPublic: isPublic !== undefined ? isPublic : true,
      documents: documents || []
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const {
      title, description, imageUrl, technologies, order, active,
      client, progress, status, startDate, endDate, isPublic, documents
    } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title, description, imageUrl, technologies, order, active,
        client: client || null, progress, status, startDate, endDate, isPublic, documents
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
