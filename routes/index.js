var express = require('express');
var router = express.Router();
var Yelp = require('yelp');

var yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
});

/* GET home page. */
router.get('/', function (req, res, next) {
    console.dir(testObj);
    res.render('index', function (err, html) {
        if (err) {
            console.error(err);
        }
        res.send(html);
    });
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
