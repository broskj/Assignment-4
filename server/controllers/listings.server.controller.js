/* Dependencies */
var mongoose = require('mongoose'),
    Listing = require('../models/listings.server.model.js');

/*
 In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
 On an error you should send a 404 status code, as well as the error message.
 On success (aka no error), you should send the listing(s) as JSON in the response.

 HINT: if you are struggling with implementing these functions, refer back to this tutorial
 from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function (req, res) {
    console.log('listing.create');
    /* Instantiate a Listing */
    var listing = new Listing(req.body);

    /* save the coordinates (located in req.results if there is an address property) */
    if (req.results) {
        listing.coordinates = {
            latitude: req.results.lat,
            longitude: req.results.lng
        };
    }

    /* Then save the listing */
    listing.save(function (err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(listing);
        }
    });
};

/* Show the current listing */
exports.read = function (req, res) {
    /* send back the listing as json from the request */
    console.log('listings.read');
    console.log(req.params);
    res.send(req.listing);
};

/* Update a listing */
exports.update = function (req, res) {
    console.log('request.update');
    console.log(req.body);/*
    req.listing.findOneAndUpdate({code: req.params.code}, req.body, function(err, listing) {
        res.send(listing);
    });*/
    var listing = req.listing;
    Listing.find({code: req.body.code}, function(err, listing) {
        if (err) throw err;
        listing.code = req.body.code;
        listing.name = req.body.name;
        if(req.results) {
            listing.coordinates = {
                latitude: req.results.lat,
                longitude: req.results.lng
            };
        }

        listing.save(function(err) {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.json(listing);
            }
        });
    });

    /* Replace the article's properties with the new properties found in req.body */
    /* save the coordinates (located in req.results if there is an address property) */
    /* Save the article */
};

/* Delete a listing */
exports.delete = function (req, res) {
    console.log('listing.delete');/*
    req.listing.findOne({ code: req.params.code }, function(err, listing) {
        if (err) throw err;

        req.listing.remove(function(err) {
            if (err) throw err;

            console.log('listing successfully deleted!');
        });
    });*/
    var listing = req.listing;
    listing.remove(function(err) {
        if (err) throw err;
        res.json(listing);
    });

    /* Remove the article */
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function (req, res) {
    /* Your code here */
    console.log('listing.list');
    Listing.find({}, null, {sort: {code:1}}, function(err, listings) {
        if (err) res.status(400).send(err);
        //res.body = listings;
        //res.send(listings);
        res.json(listings);
    });
};

/*
 Middleware: find a listing by its ID, then pass it to the next request handler.

 HINT: Find the listing using a mongoose query,
 bind it to the request object as the property 'listing',
 then finally call next
 */
exports.listingByID = function (req, res, next, id) {
    console.log('listing.listingById');
    Listing.findById(id).exec(function (err, listing) {
        if (err) {
            res.status(400).send(err);
        } else {
            req.listing = listing;
            next();
        }
    });
};
