const express = require('express');
const app = express();
// logger
const morgan = require('morgan');
// body-parser
const bodyParser = require('body-parser');

// mongoose for db interaction
const mongoose = require('mongoose');

// declare routes
const artistsRoutes = require('./api/routes/artists');
const albumRoutes = require('./api/routes/albums');
const songRoutes = require('./api/routes/songs');
const userRoutes = require('./api/routes/user');
const xauthRoutes = require('./api/routes/xauth');

// make a connection to the mongoBD database
mongoose.connect('mongodb+srv://saviganga:' + process.env.DB_PASSWORD + '@musipediadb.yjiqo.mongodb.net/?retryWrites=true&w=majority');

// setting the logs
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

// setting the body parser (parses the body that comes with post requests etc)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set headers (handling cors error)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Accept", "application/json");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
  });
  

// handle valid requests
app.use('/artists', artistsRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);
app.use('/users', userRoutes);
app.use('/xauth', xauthRoutes);


// handle 404 not fond errors errors
app.use((req, res, next) => {

    // initialize an error variable
    const error = new Error('Page not Found');

    // set the error status code
    error.status = 404;

    // push to the next function
    next(error);
});

// handle all errors
app.use((error, req, res, next) => {

    // return response for the status in the error object and it's message. also handle 500
    res.status(error.status || 500).json({
        message: error.message
    }); 

});



module.exports = app
