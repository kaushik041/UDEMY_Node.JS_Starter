const app = require('./app')

//server connection
const port = 3000;
app.listen(port, ()=>{
    console.log('project is running on port : '+ `${port}`);
}); 