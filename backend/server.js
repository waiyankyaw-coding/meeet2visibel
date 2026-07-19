const express = require('express');
const morgan = require("morgan");
const cors = require('cors');
require('dotenv').config()
const usersRouter = require('./route/users');
const bookingsRouter = require('./route/bookings');
const mongoose = require('mongoose');
const mongooURL = process.env.DB;  // mongoDb url 

const app = express();
app.use(cors({
  origin: ['https://meeting.waiyankyaw.com', 'https://www.meeting.waiyankyaw.com'],
}));
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/',usersRouter);  // user routes
app.use('/api/',bookingsRouter);  // booking routes

//Dn connections
mongoose.connect(mongooURL).then(()=>{
     console.log('db connected');
     // server start in port 4k after db connected
    app.listen(4000,()=>{
    console.log('running on 4k..');
})
}).catch((err)=>{
    console.log('Database connection fail !');
})

