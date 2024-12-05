const express = require('express');
const { signup, verifyEmail, login} = require('../controllers/authController');
const { googleLogin, appleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.get('/verify-email', verifyEmail)
router.post('/login', login);
// router.post('/google', googleLogin);

module.exports = router;
