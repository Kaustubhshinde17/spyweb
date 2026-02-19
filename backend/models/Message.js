const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
        },
        status: {
            type: String,
            enum: ['New', 'In Progress', 'Resolved'],
            default: 'New',
        },
        isAdminReply: {
            type: Boolean,
            default: false,
        },
        adminReply: {
            type: String,
        },
        replyDate: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Message', messageSchema);
