
const express = require('express');
const router = express.Router();
const { register, login, listUsers, updateBalance, editName, sendNotification } = require('../controllers/authController');
const { googleAuth, googleCallback } = require('../services/oauth');

// Admin endpoints
router.get('/users', listUsers);
router.post('/user/balance', updateBalance);
router.post('/user/name', editName);
router.post('/user/notify', sendNotification);

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback, (req, res) => {
	// Successful authentication, redirect or respond
	res.json({ message: 'Google OAuth successful', user: req.user });
});

module.exports = router;
