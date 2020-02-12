const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClear = require('xss-clean');
const http = require("http");
const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const AppError = require('./utils/appErrors')
const errorHandler = require('./controllers/errorController');

//using global Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//request limit handler
const limiter = rateLimit({
    max:100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request, try after 1 hour'
});

//Request limit middleware
app.use(limiter);

//HTTP security middleware
app.use(helmet());

//req.body size limit middleware
app.use(express.json({ limit: '10kb' }))

//data sanitization against noSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS(prevent HTML malicious code injection)
app.use(xssClear());

//app.use(express.static(`${__dirname}/public`))
//custom Middleware for displaying the request time
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
})

//router middleware
app.use('/v1/tours', tourRouter);
app.use('/v1/users',userRouter);
app.use('/v1/reviews',reviewRouter);

app.all('*', (req,res,next)=>{
    next(new AppError('URL not found in the server', 404));
});

app.use(errorHandler);

module.exports = app;