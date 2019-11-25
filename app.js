const express = require('express');
const morgan = require('morgan');
var http = require("http");
var fs = require('fs');
const app = express();

//using Middleware
app.use(morgan('dev'));
app.use(express.json());
//custom Middleware for displaying the request time
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//request methods
const getAllTours = (req, res)=>{
    res.status(200).json({
        status:'success',
       requestedAt:  req.requestTime,
        resultList: tours.length,
        data:{
            tour:tours
        }
    });
}
const getSingleTour = (req, res)=>{
    console.log(req.params);
    const id = req.params.id*1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    });
}
const postSingleTour = (req,res)=>{
    const newID = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id:newID}, req.body);

    tours.push(newTour);

    fs.writeFile(
       `${__dirname}/dev-data/data/tours-simple.json`,
       JSON.stringify(tours),
       err=>{
           res.status(201).json({
               status:'success',
               data:{
                   tours:newTour
               }
           });
       }
    )
    res.send('done');
}
const updateSingleTour = (req,res)=>{
    if(req.params.id> tours.length){
            return res.status(404).json({
                status:'fail',
                message:'Invalid ID'
            });
    }
    res.status(200).json({
        status:'success',
        message:'tour data updated'
    })
}

//user 

const getAllUsers = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}
const getUser = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}
const postUser = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}
const UpdateUser = (req,res) =>{
    res.status(500).json({
        status:'fail',
        message:'user API is not ready'
    })
}

//API Handler

const tourRoute = express.Router();
const userRouter = express.Router();

//tour route
tourRoute.route('/')
.get(getAllTours)
.post(postSingleTour)

tourRoute.route('/:id')
.get(getSingleTour)
.patch(updateSingleTour)

//user route
userRouter.route('/')
.get(getAllUsers)
.post(postUser)

userRouter.route('/:id')
.get(getUser)
.patch(UpdateUser)

app.use('/v1/tours', tourRoute);
app.use('/v1/users',userRouter);

//server connection
const port = 3000;
app.listen(port, ()=>{
    console.log('project is running on port : '+ `${port}`);
}); 