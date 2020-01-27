const User = require('./../models/userModel');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appErrors');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const {promisify} = require('util');

const userToken = id => {
    return jwt.sign({id : id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN })//payload+signature+duration
};

const createTokenAndStatus = (user, statusCode, res) => {
    const token = userToken(user._id);
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
};

exports.signup = catchAsync ( async (req,res,next) => {
    const new_user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirm_password : req.body.confirm_password,
        roles : req.body.roles
    });

    createTokenAndStatus(new_user, 201, res);
    
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
    createTokenAndStatus(user, 200, res);
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
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.roles)){
            return next(new appError('Access denied !!!', 403));
        }
        next();
    }
};

exports.forgetPassword = catchAsync( async (req,res,next) => {

    //check user
    const user = await User.findOne({email: req.body.email});
    if(!user)
        return next(new appError('user not found', 404));

    //generate random token    
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    //sending forget password email to user
    const emailURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forget your password ? Reset your password with the URL \n ${emailURL}`;
    
    try{
        await sendEmail({
            email : user.email,
            subject : 'your password reset token (expires in 10minutes)', message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to Email'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new appError('There was an error sending the mail !!!', 500))
    }
    //next();
});

exports.resetPassowrd = catchAsync( async (req, res, next) => {

    // get user based token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken : hashedToken, passwordTokenExpire : {
        $gt: Date.now()
    }})

    //check the user with token
    if(!user){
        return next(new appError('Invalid token / Session expired', 400))
    }
    user.password = req.body.password;
    user.confirm_password = req.body.confirm_password;
    user.passwordResetToken = undefined;
    user.passwordTokenExpire = undefined;
    await user.save();

    //log the user in with sending token
    createTokenAndStatus(user, 201, res);
});

exports.updatePassword = catchAsync( async (req, res, next) => {

    //check user
    const user = await User.findById(req.user.id).select('+password');

    //password checking
    if(! await(user.passwordCheck(req.body.previous_password,user.password)))
        return next(new appError('Password is not matched', 401));

    //change the password
    user.password = req.body.password;
    user.confirm_password = req.body.confirm_password;  
    await user.save();  

    //log the user in with sending token
    createTokenAndStatus(user, 201, res);
});