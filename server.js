const app = require('./app')

const dotenv = require('dotenv')
dotenv.config({path: './config.env'});

//console.log(process.env.NODE_ENV);


//server connection
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('project is running on port : '+ `${port}`);
}); 