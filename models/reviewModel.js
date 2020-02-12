const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    review: {
        type:String,
        required: [true, 'review cannot be empty']
    },
    ratting: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Tour cannot be empty']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User cannot be empty']
    }
},
{
    //virtual properties
    toJSON : {virtuals:true},
    toObject: {virtuals:true}
});

module.exports = mongoose.model('Review', reviewSchema);