const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res)=>{
    try{
        const tours = await Tour.find();
        res.status(200).json({
            status:'success',
            data:{
                tours
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
