const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendEmail } = require('../config/email');
const { autoReplyTemplate } = require('../utils/emailTemplates');

// @route   GET /api/contacts
// @desc    Get all contact form submissions
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/contacts
// @desc    Submit contact form (public endpoint)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = new Contact({
      name,
      email,
      message,
      status: 'new',
    });

    // Save contact to database
    const savedContact = await contact.save();
    console.log('✅ Contact saved to database');

    // Send auto-reply email to user
    // Note: Email sending happens in background, won't block the response
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const emailTemplate = autoReplyTemplate(name, message);
      sendEmail(email, emailTemplate.subject, emailTemplate.html)
        .then(result => {
          if (result.success) {
            console.log(`✉️  Auto-reply sent to ${email}`);
          } else {
            console.error(`❌ Failed to send email to ${email}:`, result.error);
          }
        })
        .catch(error => {
          console.error('❌ Email error:', error);
        });
    } else {
      console.warn('⚠️  Email not configured - skipping auto-reply');
    }

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      contact: savedContact 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update contact status
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact submission
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
