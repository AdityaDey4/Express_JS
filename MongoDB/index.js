const express=require('express');
const { json } = require('express');
const mongoose=require('mongoose');
const students=require('./router/students');

mongoose.connect("mongodb://localhost:27017/mern03",{useNewUrlParser: true, useUnifiedTopology: true, family: 4})
.then(console.log('Connection is established with Mongodb'))
.catch(err=>console.log('Connection is not established'))

const app=express();
app.use(json());

// app.get('/', (req,res)=>{
//     res.send('hello');
// })

app.use('/api/students', students);

const port=process.env.PORT || 3000
app.listen(port);
console.log(`Server Listening PORT is ${port}`);