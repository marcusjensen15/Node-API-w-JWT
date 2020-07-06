const express = require('express');
const app = express();
const port = 3000;

//Import routes

const authRoute = require('./routes/auth');


//Route Middlewares


app.use('/api/user', authRoute);

app.listen(port, () => console.log('running on port ' + port));
