var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var passport = require('passport');
var Yelp = require('yelp');
var mongoose = require('mongoose');
//Remember we are in the /routes directory, hence the "../"
var Patrons = require('../models/patrons.js');

var yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
});

function isAuthed(req, res, next) {
    if (req.user) {
        console.log("User is authenticated");
        return next();
    }
    
    res.status(401).send("Not authenticated");
}


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', function (err, html) {
        if (err) {
            console.error(err);
        }
        res.send(html);
    });
});

/* TODO: Remove after testing */
router.get('/authcheck', isAuthed, function(req, res, next) {
    res.send("Yep");
});

router.get('/auth/twitter', function (req, res, next) {
    req.session.cburl = req.query.cbHash;
    passport.authenticate('twitter', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
    })(req, res, next);
});

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect : '/authreturn',
	failureRedirect : '/'
}));

router.get('/authreturn', function(req, res) {
    console.log("Auth return called...");
    //console.dir(req);
    if (typeof req.session.cbHash !== "undefined" && req.session.cbHash.length > 0) {
        res.redirect("/" + req.session.cbHash); //This preceding slash is required so the redirect will not be relative to '/authreturn'
        
        res.end(); //End this request since the browser will make a seperate request for the page we are redirecting to
    }
    else {
        res.render('index', function (err, html) {
            if (err) {
                console.error(err);
            }
            res.send(html);
        });
    }
    
});

router.post('/imgoing', isAuthed, function (req, res) {
    console.log(chalk.green("Someone's going!"));
    var listingId = req.body.listingId;
    Patrons.findOne({"listingId": listingId}).then(
        function(result) {
            if (result === null) {
                console.log(chalk.gray("Listing does not exist, yet..."));
                var patron = new Patrons();    
                patron.listingId = listingId;
                var user = {provider: req.user.provider, 
                            id: req.user.id, 
                            username: req.user.username};
                patron.patrons.push(user);
                patron.save(function(err) {
                    if (err) {
                        res.status(500);
                        console.error("Error while saving listing: " + err);
                    }
                    else {
                        res.status(200);
                        console.log("New listing w/ patron created without errors");
                    }
                });
            }
            else {
                console.log(chalk.green("Listing already exists!"));
                console.dir(result);
                result._doc.patrons.push({provider: "fake", id: 12345, username: "foo"});
                result.save(function(err) {
                    if (err) {
                        res.status(500);
                        console.error("Error2 while saving listing: " + err);
                    }
                    else {
                        res.status(200);
                        console.log("Updated listing w/o errors");
                    }
                });
            }
        },
        function(err) {
            console.error(chalk.red("Error") + ": " + err.stack);
        }
    );
        
});

router.post('/search', function(req, res, next) {
    var query = req.body.query;
    console.log("Parsing query: " + query);
    if (/^\d{5}$|^\d{5}-\d{4}$/.test(query)) {
        console.log("Query is a zip code (5 or 9)");
        yelp.search({ term: 'bars', location: query})
        .then(function(data) {
            console.log("At then");
            res.json(data);
        })
        .catch(function(err) {
           console.error(err); 
        });
    }
    else if (/^(\+|\-)?([0-8]\d|90|[0-9])(\.\d{1,10}),\ ?(\+|\-)?(1[0-7]\d|\|180|\d\d?)(\.\d{1,10})?$/.test(query)) {
        console.log("Query is a lat, long");
        // https://www.yelp.com/developers/documentation/v2/search_api#searchGC
        yelp.search({ term: 'bars', ll: query})
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
           console.error(err); 
        });
    }
    else {
        console.log("Query is a city/place");
        //TODO: Add search for city/place
    }
    
    
    
});

module.exports = router;
