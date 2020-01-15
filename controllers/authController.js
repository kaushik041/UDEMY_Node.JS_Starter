const User = require('./../models/userModel');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appErrors')
const {promisify} = require('util');

const userToken = id => {
    return jwt.sign({id : id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN })//payload+signature+duration
}

exports.signup = catchAsync ( async (req,res,next) => {
    const new_user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirm_password : req.body.confirm_password
    });

    const token = userToken(new_user._id);
    res.status(201).json({
        status:'success',
        token,
        data:{
            user : new_user
        }
    })
});

exports.login = catchAsync( async (req,res,next) =>{
    const {email,password} = req.body;

    //checking email/password
    if(!email || !password) {
       return next(new appError('please provide Email/Password', 400)); 
    }
    //checking email exist
    const user = await User.findOne({email: email}).select('+password');
    
    if(!user || !(await user.passwordCheck(password, user.password))){
        return next(new appError('Credentials doesnot match', 401));
    }
    const token = userToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
        message: 'User Logged In'
    })
});

exports.protectRoute = catchAsync( async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('tour-access')){
        token = req.headers.authorization.split(' ')[1];
    }
    //console.log(token);
    if(!token){ 
        return next(new appError('You are not logged in !!!', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const userCheck = await User.findById(decoded.id);
    if(!userCheck)
        return next(new appError('User does not exist !!!', 401))   
        
    if(userCheck.passwordChanged(decoded.iat))
            return next(new appError('User changed password ! Please Log in to continue !!!', 401))

    req.user = userCheck;        
    next();
})