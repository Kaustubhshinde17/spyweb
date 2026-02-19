const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: '',
    },
    mission: {
      type: String,
      default: '',
    },
    vision: {
      type: String,
      default: '',
    },
    values: {
      type: String,
      default: '',
    },
    leadership: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('About', aboutSchema);
