const express = require('express');
const morgan = require('morgan');
const http = require("http");
const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

//using Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.json());
//app.use(express.static(`${__dirname}/public`))
//custom Middleware for displaying the request time
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
})

//router middleware
app.use('/v1/tours', tourRouter);
app.use('/v1/users',userRouter);

app.all('*', (req,res,next)=>{
    res.status(404).json({
        status:'fail',
        message:'URL not found or cannot access'
    });
    next();
});

module.exports = app;