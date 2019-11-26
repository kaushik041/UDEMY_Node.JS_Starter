var fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res)=>{
    res.status(200).json({
        status:'success',
       requestedAt:  req.requestTime,
        resultList: tours.length,
        data:{
            tour:tours
        }
    });
}
exports.getSingleTour = (req, res)=>{
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
exports.postSingleTour = (req,res)=>{
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
exports.updateSingleTour = (req,res)=>{
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
