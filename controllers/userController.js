const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const appError = require('./../utils/appErrors');


//field filtering/ selection handler
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if( allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};

exports.deleteMe = catchAsync ( async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {active : false });
    res.status(204).json({
        status: 'success',
        data:null
    }); 
});

exports.updateMe = catchAsync( async (req, res, next) => {
    //password updating validation
    if(req.body.password || req.body.confirm_password){
        return next(new appError('cannot modify password', 400));
    }

    //update user with specific field
    const updateField = filterObj(req.body, 'name', 'email');
    const updateUser = await User.findByIdAndUpdate(req.user.id, updateField, {
        runValidators: true,
        new: true
    });
    res.status(204).json({
        status: 'success',
        data: {
            user: updateUser
        }
    }); 
})