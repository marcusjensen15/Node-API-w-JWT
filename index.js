const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const apiKey = require('./apiKey');
const postRoute = require('./routes/posts');
//Import routes

const authRoute = require('./routes/auth');

//connnect to DB

mongoose.connect(apiKey.creds,
{ useNewUrlParser: true },
() => console.log('connected to db!'));

//Middleware

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(port, () => console.log('running on port ' + port));
