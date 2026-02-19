const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    documents: [
      {
        title: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      default: null, // Public portfolio projects might not have a specific client user
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Planning', 'Design', 'Development', 'Testing', 'Deployed', 'Maintenance', 'Completed'],
      default: 'Planning',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
