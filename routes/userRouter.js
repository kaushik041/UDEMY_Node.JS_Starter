const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');

router.post('/singup', authController.signup);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.patch('/reset-password/:token', authController.resetPassowrd);

module.exports = router;