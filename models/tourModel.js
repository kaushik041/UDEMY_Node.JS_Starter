const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'name field required'],
        unique:true
    },
    rating:{
        type:Number,
        default: 4.5
    },
    price:{
        type:Number,
        required:[true, 'price field required']
    }
});

module.exports = mongoose.model('Tour', tourSchema);