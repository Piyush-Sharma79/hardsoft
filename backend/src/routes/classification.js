const express = require('express');
const router = express.Router();
const CowHealth = require('../models/CowHealth');

// Helper function to calculate classification
function calculateClassification(data) {
  let riskFactors = 0;
  let confidence = 0.5; // Base confidence

  // Check temperature (normal range for cows: 38.0-39.3°C)
  if (data.temperature > 39.3) {
    riskFactors += 2;
    confidence += 0.15;
  }

  // Check months after calving (first 3 months are higher risk)
  if (data.monthsAfterCalving <= 3) {
    riskFactors += 1;
    confidence += 0.1;
  }

  // Check measurement asymmetry
  const checkAsymmetry = (measurements) => {
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const maxDiff = Math.max(...measurements.map(m => Math.abs(m - avg)));
    return maxDiff > avg * 0.3; // 30% threshold for significant asymmetry
  };

  if (checkAsymmetry(data.measurements.leftRight)) {
    riskFactors += 2;
    confidence += 0.15;
  }

  // Classify based on risk factors
  const isUnhealthy = riskFactors >= 3;

  // Adjust confidence based on total assessment
  confidence = Math.min(0.95, Math.max(0.5, confidence));

  return {
    classification: isUnhealthy ? 'unhealthy' : 'healthy',
    confidence
  };
}

// POST endpoint for classification
router.post('/', async (req, res) => {
  try {
    const {
      measurements,
      monthsAfterCalving,
      temperature
    } = req.body;

    // Validate input
    if (!measurements?.exhaleInhale || !measurements?.frontRear || !measurements?.leftRight ||
        monthsAfterCalving === undefined || temperature === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate classification
    const result = calculateClassification({
      measurements,
      monthsAfterCalving,
      temperature
    });

    // Create new record
    const cowHealth = new CowHealth({
      measurements,
      monthsAfterCalving,
      temperature,
      ...result
    });

    // Save to database
    await cowHealth.save();

    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint for historical data
router.get('/history', async (req, res) => {
  try {
    const history = await CowHealth.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
