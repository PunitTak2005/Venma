const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Create Stripe Payment Intent (Test Mode)
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // In Stripe test mode simulation / integration:
    const clientSecret = `pi_test_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 10)}`;

    res.json({
      success: true,
      clientSecret,
      currency: 'usd',
      amount: Math.round(amount * 100),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
