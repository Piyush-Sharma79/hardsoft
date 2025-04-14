const express = require('express');
const router = express.Router();
const CowHealth = require('../models/CowHealth');

// Information about Mastitis
const MASTITIS_INFO = {
  description: "Mastitis is an inflammation of the mammary gland and udder tissue in dairy cows. " +
               "It's usually caused by bacterial infection and can be detected through physical changes " +
               "in the udder, milk, and various measurements.",
  risk_factors: [
    "Abnormal temperature (above 39.5°C)",
    "Early lactation period (first 3 months after giving birth)",
    "Significant asymmetry in udder measurements",
    "Difference between inhale and exhale measurements"
  ]
};

// Helper function to calculate classification
function calculateClassification(data) {
  let riskFactors = 0;
  let confidence = 0.5; // Base confidence

  // Check temperature (normal range for cows: 38.0-39.3°C)
  if (data.temperature > 39.3) {
    riskFactors += 2;
    confidence += 0.15;
  }

  // Check months after giving birth (first 3 months are higher risk)
  if (data.months_after_giving_birth <= 3) {
    riskFactors += 1;
    confidence += 0.1;
  }

  // Check udder asymmetry
  const measurements = data.udderMeasurements;

  // Compare left vs right side measurements
  const leftSideAvg = (measurements.IUFL + measurements.EUFL + measurements.IURL + measurements.EURL) / 4;
  const rightSideAvg = (measurements.IUFR + measurements.EUFR + measurements.IURR + measurements.EURR) / 4;

  if (Math.abs(leftSideAvg - rightSideAvg) > (leftSideAvg * 0.2)) { // 20% threshold
    riskFactors += 2;
    confidence += 0.15;
  }

  // Check inhale-exhale differences
  const checkInhaleExhaleDiff = (inhale, exhale) => {
    return Math.abs(inhale - exhale) > (inhale * 0.3); // 30% threshold
  };

  if (checkInhaleExhaleDiff(measurements.IUFL, measurements.EUFL) ||
      checkInhaleExhaleDiff(measurements.IUFR, measurements.EUFR) ||
      checkInhaleExhaleDiff(measurements.IURL, measurements.EURL) ||
      checkInhaleExhaleDiff(measurements.IURR, measurements.EURR)) {
    riskFactors += 2;
    confidence += 0.15;
  }

  // Classify based on risk factors
  const hasMastitis = riskFactors >= 3;

  // Adjust confidence based on total assessment
  confidence = Math.min(0.95, Math.max(0.5, confidence));

  return {
    health_status: hasMastitis ? 'mastitis' : 'healthy',
    confidence,
    risk_factors: riskFactors,
    info: MASTITIS_INFO
  };
}

// POST endpoint for classification
router.post('/', async (req, res) => {
  try {
    const {
      udderMeasurements,
      months_after_giving_birth,
      temperature
    } = req.body;

    // Validate input
    if (!udderMeasurements || !months_after_giving_birth || !temperature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate classification
    const result = calculateClassification({
      udderMeasurements,
      months_after_giving_birth,
      temperature
    });

    // Create new record
    const cowHealth = new CowHealth({
      udderMeasurements,
      months_after_giving_birth,
      temperature,
      health_status: result.health_status,
      confidence: result.confidence
    });

    // Save to database
    await cowHealth.save();

    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint for mastitis information
router.get('/info', (req, res) => {
  res.json(MASTITIS_INFO);
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
