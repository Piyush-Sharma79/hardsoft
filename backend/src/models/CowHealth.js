const mongoose = require('mongoose');

const cowHealthSchema = new mongoose.Schema({
  udderMeasurements: {
    IUFL: { type: Number, required: true }, // Inhale Upper Front Left
    EUFL: { type: Number, required: true }, // Exhale Upper Front Left
    IUFR: { type: Number, required: true }, // Inhale Upper Front Right
    EUFR: { type: Number, required: true }, // Exhale Upper Front Right
    IURL: { type: Number, required: true }, // Inhale Upper Rear Left
    EURL: { type: Number, required: true }, // Exhale Upper Rear Left
    IURR: { type: Number, required: true }, // Inhale Upper Rear Right
    EURR: { type: Number, required: true }, // Exhale Upper Rear Right
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
