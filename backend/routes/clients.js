const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// @route   GET /api/clients
// @desc    Get all clients with optional search and status filter
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search across name, email, and company
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/clients/:id
// @desc    Get single client by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/clients
// @desc    Create new client
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, address, status } = req.body;

    // Check if client with email already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }

    // Generate a random password since admin doesn't set it
    // In a real app, you might want to email this to the client
    const crypto = require('crypto');
    const password = crypto.randomBytes(8).toString('hex');

    const client = new Client({
      name,
      email,
      phone,
      company,
      address,
      status: status || 'active',
      password,
    });

    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, company, address, status } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingClient = await Client.findOne({ email, _id: { $ne: req.params.id } });
      if (existingClient) {
        return res.status(400).json({ message: 'Client with this email already exists' });
      }
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, address, status },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
