const Tour = require('./../models/tourModel')
const QueryFeatues = require('./../utils/apiFeatures')


exports.getExpensiveTour = (req, res, next) =>{
    req.query.limit = '5';
    req.query.sort = '-price';
    next();
}

exports.getAllTours = async (req, res)=>{
    try{
        //Execute query
        const features = new QueryFeatues(Tour.find(),req.query)
        .filter()
        .sorting()
        .paginate();

        const tour = await features.query;
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
    const tour_update = await Tour(req.params.id, req.body, {
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

exports.getTourStat = async (req, res) =>{
    try{
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage : { $gte : 4.5 } }
            },
            {
                $group: {
                   _id:null,
                    avgRating:{$avg:'$ratingsAverage'},
                    avgPrice:{$avg:'$price'}
                }
            }
        ]);
        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        })
    }catch(err){
        res.status(400).json({
            status:'failed',
            message:err 
        });
    }
}
