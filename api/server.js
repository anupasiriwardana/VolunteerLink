require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();

//importing routes
const recruiterRoutes = require('./routes/recruiterRoutes');

//middleware funcs
app.use(express.json());
app.use((req,res,next) => {
    console.log(req.path, req.method);
    next();
})

//routes
app.use('/api/recruiter', recruiterRoutes);

//listen for requests
//Connecting to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB and listening on port 4000");
        });
    })
    .catch((err) => {console.log(err)});