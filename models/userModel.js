const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Name is required']
    },
    email:{
        type: String,
        required: [true,'Email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        minlength:6
    },
    confirm_password:{
        type: String,
        required: [true,'Confirm password is required'],
        validate:{
            validator: function(el){
               return el === this.password //only works for SAVE/CREATE method
            },
            message:'password is not matched'
        }
    },
    user_image:{
        type: String
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) 
        return next();

    this.password = await bcrypt.hash(this.password, 12);//hash the password with cost 12
    this.confirm_password = undefined;//delete the confirm password field
    next();
});

module.exports = mongoose.model('User', userSchema);