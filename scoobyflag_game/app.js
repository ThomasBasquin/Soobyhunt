const express=require('express');
const bodyParser = require ('body-parser');
const app=express();
const port=1650;

//Middleware LOG
app.use((req,res,next)=>{
    console.log(`Request ${req.method} from ${req.ip}`);
    next();
})

app.get('/hello',(req,res)=>{
    res.send(`Bonjour ${req.name}`);
})

app.listen(port,() =>{
    console.log(`Exemple app lisening on port ${port}`)
})
