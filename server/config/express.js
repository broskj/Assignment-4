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

    //tell app to use jade
    app.set('views', './client/views')
    app.set('view engine', 'jade');


    //enable request logging for development debugging
    app.use(morgan('dev'));

    //body parsing middleware
    app.use(bodyParser.json());

    /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
    app.post('/api/coordinates', getCoordinates, function (req, res) {
        res.send(req.results);
    });

    /* serve static files */
    //access static files with '/static/styles/main.css' etc
    app.use('/static', express.static('client'));

    /* use the listings router for requests to the api */
    app.get('/api/*', function (req, res, next) {
        console.log('the response will be sent by the next function ...');
        next();
    }, function (req, res) {
        console.log(req.params);
        listingsRouter.get('listings/' + req.params._id);
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