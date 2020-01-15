const express = require('express');
const morgan = require('morgan');
const http = require("http");
const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appErrors')
const errorHandler = require('./controllers/errorController');
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
    next(new AppError('URL not found in the server', 404));
});

app.use(errorHandler);


module.exports = app;