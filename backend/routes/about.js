const express = require('express');
const router = express.Router();
const About = require('../models/About');

// @route   GET /api/about
// @desc    Get about content
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get the first (and should be only) about document
    let about = await About.findOne();
    
    // If no about document exists, create a default one
    if (!about) {
      about = new About({
        description: 'Welcome to SPYWEB - Your trusted partner in digital solutions.',
        mission: 'To deliver innovative and secure digital solutions.',
        vision: 'To be the leading provider of cutting-edge technology services.',
        values: 'Innovation, Security, Excellence',
        leadership: [],
      });
      await about.save();
    }
    
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/about
// @desc    Update about content
// @access  Admin
router.put('/', async (req, res) => {
  try {
    const { description, mission, vision, values, leadership } = req.body;

    // Find existing document or create new one
    let about = await About.findOne();
    
    if (!about) {
      about = new About({
        description,
        mission,
        vision,
        values,
        leadership: leadership || [],
      });
    } else {
      about.description = description !== undefined ? description : about.description;
      about.mission = mission !== undefined ? mission : about.mission;
      about.vision = vision !== undefined ? vision : about.vision;
      about.values = values !== undefined ? values : about.values;
      about.leadership = leadership !== undefined ? leadership : about.leadership;
    }

    const savedAbout = await about.save();
    res.json(savedAbout);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
