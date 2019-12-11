const mongoose = require('mongoose');
const app = require('./app')

const dotenv = require('dotenv')
dotenv.config({path: './config.env'});

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
})
//server connection
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('project is running on port : '+ `${port}`);
}); 