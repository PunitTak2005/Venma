const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
