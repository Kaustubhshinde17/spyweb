const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');
const { protectClient } = require('../middleware/authClient');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'spyweb_secret_key', {
    expiresIn: '30d',
  });
};

// @route   POST /api/clients/auth/signup
// @desc    Register a new client
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body;

    // Check if client exists
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    // Create new client
    const client = await Client.create({
      name,
      email,
      password,
      company,
      phone,
    });

    if (client) {
      res.status(201).json({
        _id: client._id,
        name: client.name,
        email: client.email,
        company: client.company,
        token: generateToken(client._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid client data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/clients/auth/login
// @desc    Authenticate client & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for client email
    const client = await Client.findOne({ email }).select('+password');

    if (client && (await client.matchPassword(password))) {
      res.json({
        _id: client._id,
        name: client.name,
        email: client.email,
        company: client.company,
        token: generateToken(client._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/clients/auth/me
// @desc    Get current client profile
// @access  Private
router.get('/me', protectClient, async (req, res) => {
  // req.client is set by middleware
  res.json(req.client);
});

// @route   PUT /api/clients/auth/profile
// @desc    Update client profile
// @access  Private
router.put('/profile', protectClient, async (req, res) => {
  try {
    const client = await Client.findById(req.client._id);

    if (client) {
      client.name = req.body.name || client.name;
      client.email = req.body.email || client.email;
      client.phone = req.body.phone || client.phone;
      client.company = req.body.company || client.company;
      client.address = req.body.address || client.address;

      if (req.body.password) {
        client.password = req.body.password;
      }

      const updatedClient = await client.save();

      res.json({
        _id: updatedClient._id,
        name: updatedClient.name,
        email: updatedClient.email,
        company: updatedClient.company,
        phone: updatedClient.phone,
        address: updatedClient.address,
        token: generateToken(updatedClient._id),
      });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
