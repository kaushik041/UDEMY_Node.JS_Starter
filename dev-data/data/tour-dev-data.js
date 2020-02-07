const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const Tour = require('./../../models/tourModel');

//console.log(process.env.NODE_ENV);
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(() => {
    //console.log(con.connections);
    console.log('Database Connection installed successfully');
});

//Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

//Import file data to MongoDB
const tourImport = async() =>{
    try{
        await Tour.create(tours);
        console.log('Data Imported to Database');
        process.exit();
    }catch(err){
        console.log(err);
    }
}

//Delete data from database
const tourRemove = async() =>{
    try{
        await Tour.deleteMany(tours);
        console.log('Data removed from Database');
        process.exit();
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    tourImport();
}else if(process.argv[2] === '--delete'){
    tourRemove();
}
