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
        minlength:6,
        select: false
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
    roles:{
        type:String,
        enum:['user','admin','guide'],
        default:'user'
    },
    user_image:{
        type: String
    },
    passwordChangedAt: Date,
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) 
        return next();

    this.password = await bcrypt.hash(this.password, 12);//hash the password with cost 12
    this.confirm_password = undefined;//delete the confirm password field
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

userSchema.methods.passwordCheck = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

userSchema.methods.passwordChanged = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const timeStampChange = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        //console.log(this.passwordChangedAt,JWTTimestamp);
        return JWTTimestamp < timeStampChange;
    }
    return false;
}


module.exports = mongoose.model('User', userSchema);