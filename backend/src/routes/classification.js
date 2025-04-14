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

  // Check measurement asymmetry between left and right sides
  const leftSideAvg = (Number(data.udderMeasurements.IUFL) + Number(data.udderMeasurements.EUFL) +
                       Number(data.udderMeasurements.IURL) + Number(data.udderMeasurements.EURL)) / 4;
  const rightSideAvg = (Number(data.udderMeasurements.IUFR) + Number(data.udderMeasurements.EUFR) +
                        Number(data.udderMeasurements.IURR) + Number(data.udderMeasurements.EURR)) / 4;

  const asymmetryPercentage = Math.abs(leftSideAvg - rightSideAvg) / ((leftSideAvg + rightSideAvg) / 2);

  if (asymmetryPercentage > 0.3) { // More than 30% difference
    riskFactors += 2;
    confidence += 0.15;
  }

  // Check inhale-exhale differences
  const checkBreathingDifference = (inhale, exhale) => {
    const diff = Math.abs(inhale - exhale);
    return diff > (inhale * 0.4); // More than 40% difference between inhale and exhale
  };

  // Check each quarter for breathing irregularities
  const quarters = [
    { inhale: data.udderMeasurements.IUFL, exhale: data.udderMeasurements.EUFL },
    { inhale: data.udderMeasurements.IUFR, exhale: data.udderMeasurements.EUFR },
    { inhale: data.udderMeasurements.IURL, exhale: data.udderMeasurements.EURL },
    { inhale: data.udderMeasurements.IURR, exhale: data.udderMeasurements.EURR }
  ];

  const irregularQuarters = quarters.filter(q =>
    checkBreathingDifference(Number(q.inhale), Number(q.exhale))
  ).length;

  if (irregularQuarters >= 2) {
    riskFactors += 2;
    confidence += 0.15;
  }

  // Classify based on risk factors
  const isUnhealthy = riskFactors >= 3;

  // Adjust confidence based on total assessment
  confidence = Math.min(0.95, Math.max(0.5, confidence));

  return {
    classification: isUnhealthy ? 'unhealthy' : 'healthy',
    confidence,
    riskFactors,
    details: {
      temperatureRisk: data.temperature > 39.3,
      calvingRisk: data.monthsAfterCalving <= 3,
      asymmetryRisk: asymmetryPercentage > 0.3,
      breathingIrregularities: irregularQuarters
    }
  };
}

// POST endpoint for classification
router.post('/', async (req, res) => {
  try {
    const {
      udderMeasurements,
      monthsAfterCalving,
      temperature
    } = req.body;

    // Validate input
    if (!udderMeasurements?.IUFL || !udderMeasurements?.EUFL ||
        !udderMeasurements?.IUFR || !udderMeasurements?.EUFR ||
        !udderMeasurements?.IURL || !udderMeasurements?.EURL ||
        !udderMeasurements?.IURR || !udderMeasurements?.EURR ||
        monthsAfterCalving === undefined || temperature === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: { udderMeasurements, monthsAfterCalving, temperature }
      });
    }

    // Calculate classification
    const result = calculateClassification({
      udderMeasurements,
      monthsAfterCalving,
      temperature
    });

    // Create new record
    const cowHealth = new CowHealth({
      udderMeasurements,
      monthsAfterCalving,
      temperature,
      classification: result.classification,
      confidence: result.confidence
    });

    // Save to database
    await cowHealth.save();

    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
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
