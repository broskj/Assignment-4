var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'),
    getCoordinates = require('../controllers/coordinates.server.controller.js');

module.exports.init = function () {
    //connect to database
    mongoose.connect(config.db.uri);

    //initialize app
    var app = express();


    //enable request logging for development debugging
    app.use(morgan('dev'));

    //body parsing middleware
    app.use(bodyParser.json());
    app.use(listingsRouter);

    /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
    app.post('/api/coordinates', getCoordinates, function (req, res) {
        res.send(req.results);
    });

    /* serve static files */
    //access static files with '/static/styles/main.css' etc
    app.use(express.static('client'));
    app.use('views', express.static('./client/views'));


    /* use the listings router for requests to the api */
    app.get('/api/listings', function(req, res, next) {
        res.send(req.results);
    });

    //save a listing
    app.post('/api/listings', function(req, res) {
        res.send(req.results);
    });

    app.get('/api/listings/:listingId', function(req, res, next) {
        res.send(req.results);
    });

    app.get('/', function (req, res, next) {
        console.log('the response will be sent by the next function ...');
        next();
    }, function (req, res) {
        res.sendFile(path.join(__dirname, '../../client/views', 'index.html'));
    });

    /* go to homepage for all routes not specified */


    return app;
};  