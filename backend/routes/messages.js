const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protectClient } = require('../middleware/authClient');
const { sendEmail } = require('../config/email');
const { supportReplyTemplate } = require('../utils/emailTemplates');

// @route   POST /api/messages
// @desc    Create a new support message
// @access  Private (Client)
router.post('/', protectClient, async (req, res) => {
    try {
        const { subject, content } = req.body;

        const message = await Message.create({
            client: req.client._id,
            subject,
            content,
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/messages
// @desc    Get all messages for current client
// @access  Private (Client)
router.get('/', protectClient, async (req, res) => {
    try {
        const messages = await Message.find({ client: req.client._id }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/messages/admin/all
// @desc    Get all messages (Admin)
// @access  Public (Should be Admin)
router.get('/admin/all', async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('client', 'name email company')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/messages/:id/reply
// @desc    Reply to a message (Admin)
// @access  Public (Should be Admin)
router.put('/:id/reply', async (req, res) => {
    try {
        const { reply, status } = req.body;

        const message = await Message.findById(req.params.id).populate('client', 'name email');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.adminReply = reply;
        message.isAdminReply = true;
        message.replyDate = Date.now();
        message.status = status || 'Resolved';

        await message.save();

        // Send email notification to client
        if (message.client && message.client.email) {
            const emailTemplate = supportReplyTemplate(message.client.name, message.subject, reply);
            sendEmail(message.client.email, emailTemplate.subject, emailTemplate.html)
                .catch(err => console.error("Failed to send reply email:", err));
        }

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
