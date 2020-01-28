const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.post('/singup', authController.signup);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.patch('/reset-password/:token', authController.resetPassowrd);
router.patch('/update-password',authController.protectRoute, authController.updatePassword);

router.delete('/delete-me', authController.protectRoute, userController.deleteMe);

module.exports = router;