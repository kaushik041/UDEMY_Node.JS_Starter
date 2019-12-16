const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res)=>{
    try{
        //query sting
        //const tours = await Tour.find().where('difficulty').equals('easy');

        //build query
        const queryObj = {...req.query};
        const fieldExclude = ['pages','sort','limit'];
        fieldExclude.forEach(el => delete queryObj[el]);
        const tours = Tour.find(queryObj);

        //advance query
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);

        let query = Tour.find(JSON.parse(queryStr));
        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('createdAt');
        }

        //pagination
        const page = req.query.page * 1 || 1;
        console.log(page);
        const limit = req.query.limit * 1 || 20;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        //Execute query
        const tour = await query;
        res.status(200).json({
            status:'success',
            results: tour.length,
            data:{
                tour
            }
        });
    }catch(err){
        res.status(400).json({
            status:'failed',
            message:err
        })
    }
}
exports.getSingleTour = async (req, res)=>{
    try{
        const single_tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status:'success',
            data:{
                single_tour  
            } 
        })
    }catch(err){
        res.status(400).json({
            status: 'failed',
            message:err
        })
    }
}
exports.postSingleTour = async (req,res)=>{ 
    try{
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status:'success',
            data:{
                tour:newTour
            }
        });
    }catch(err){
        res.status(400).json({
            status:'failed',
            message:err
        })
    } 
}
exports.updateSingleTour = async (req,res)=>{
   try{
    const tour_update = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.status(200).json({
        status:'success',
        body:{
            tour_update
        }
    })
   }catch(err){
    res.status(400).json({
        status:'failed',
        message:err 
    });
   }
}
