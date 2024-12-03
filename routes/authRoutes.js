const express = require('express');
const { signup} = require('../controllers/authController');
const { googleLogin, appleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
// router.post('/login', login);
// router.post('/google', googleLogin);

module.exports = router;
