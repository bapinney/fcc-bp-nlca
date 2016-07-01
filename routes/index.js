var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', function (err, html) {
        if (err) {
            console.error(err);
        }
        res.send(html);
    });
});

router.post('/search', function(req, res, next) {
    console.dir(req);
    res.json({result: "success"});
});

module.exports = router;
