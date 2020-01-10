const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
//user 
const getAllUsers = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}
const getUser = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}
const postUser = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}
const UpdateUser = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}

router.post('/singup', authController.signup);
router.post('/login', authController.login);

router.route('/')
.get(getAllUsers)
.post(postUser)

router.route('/:id')
.get(getUser)
.patch(UpdateUser)

module.exports = router;