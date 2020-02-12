const mongoose = require('mongoose');
//const User = require('./userModel');
const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'name field required'],
        //unique:true
    },
    
    duration:{
        type:Number,
        required:[true, 'duration field required']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'max group size is required']
    },
    difficulty:{
        type:String,
        required:[true, 'difficulty field required']
    },
    ratingsAverage:{
        type:Number,
        default: 4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'price field required']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true,'Summary field required']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'Cover image required']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
    }],
    guides: [
        {
            type:mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},{
    //virtual properties
    toJSON : {virtuals:true},
    toObject: {virtuals:true}
});
//virtual properties calculation with model properties
tourSchema.virtual('week_durations').get(function(){
    return this.duration / 7;
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    })
})

// tourSchema.pre('save',async function(next){
//     const tourPromise = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(tourPromise);
//     next();
// });

module.exports = mongoose.model('Tour', tourSchema);