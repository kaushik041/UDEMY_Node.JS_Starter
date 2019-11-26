const express = require('express');
const morgan = require('morgan');
var http = require("http");
const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

//using Middleware
app.use(morgan('dev'));
app.use(express.json());

//custom Middleware for displaying the request time
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
})

//router middleware
app.use('/v1/tours', tourRouter);
app.use('/v1/users',userRouter);

module.exports = app;