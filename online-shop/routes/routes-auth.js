const express = require('express');
const router = express.Router();
const authController = require('../controller/auth-controller');

router.get('/admin', authController.getAdminPage);
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLoginPage);
router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.postSignupForm);
router.post('/logout', authController.postLogout);

module.exports = router;
