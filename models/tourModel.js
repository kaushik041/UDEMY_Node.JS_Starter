const mongoose = require('mongoose');

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
    startDates:[Date]
});

module.exports = mongoose.model('Tour', tourSchema);