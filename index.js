const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const apiKey = require('./apiKey');

//connnect to DB

mongoose.connect(apiKey.creds,
{ useNewUrlParser: true },
() => console.log('connected to db!'));
//Import routes

const authRoute = require('./routes/auth');


//Route Middlewares


app.use('/api/user', authRoute);

app.listen(port, () => console.log('running on port ' + port));
