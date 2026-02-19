const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};

    // Filter by active status (for public website, only show active)
    if (active !== undefined) {
      query.active = active === 'true';
    }

    const services = await Service.find(query).sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/services
// @desc    Create new service
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const { icon, title, description, order, active } = req.body;

    const service = new Service({
      icon,
      title,
      description,
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const { icon, title, description, order, active } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { icon, title, description, order, active },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
