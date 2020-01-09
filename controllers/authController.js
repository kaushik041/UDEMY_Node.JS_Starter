const User = require('./../models/userModel');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
exports.signup = catchAsync ( async (req,res,next) => {
    const new_user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirm_password : req.body.confirm_password
    });

    const token = jwt.sign({id : new_user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })//payload+secret+duration
    
    res.status(201).json({
        status:'success',
        token,
        data:{
            user : new_user
        }
    })
})