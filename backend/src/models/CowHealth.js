const mongoose = require('mongoose');

const cowHealthSchema = new mongoose.Schema({
  measurements: {
    exhaleInhale: [{ type: Number, required: true }], // Array of 8 PNC measurements
    frontRear: [{ type: Number, required: true }],
    leftRight: [{ type: Number, required: true }]
  },
  monthsAfterCalving: {
    type: Number,
    required: true,
    min: 0
  },
  temperature: {
    type: Number,
    required: true
  },
  classification: {
    type: String,
    enum: ['healthy', 'unhealthy'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CowHealth', cowHealthSchema);
