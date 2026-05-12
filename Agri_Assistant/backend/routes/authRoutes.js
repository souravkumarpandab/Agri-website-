const express = require('express');
const { registerUser, authUser, getUserProfile, updateUserProfile, getUserActivities, trackActivity, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/activities', protect, getUserActivities);
router.post('/activities', protect, trackActivity);

module.exports = router;
