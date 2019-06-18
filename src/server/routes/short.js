var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Url = mongoose.model('url');

function fetchShortUrl(short, res) {
    console.log('short find url', short);
    Url.find({ short }, (err, urlObj) => {
        if (err) {
            res.send({ url: null, message: 'Error in processing' });
            } else if (urlObj.length > 0) {
            const fullUrl = urlObj[0].url;
            res.send({ url: fullUrl });
            } else {
            res.send({ url: null, message: 'Url does not exist' });
            }
    });
 }

router.route('/')
 .post((req, res) => {
    const { short } = req.body;
    // const ip = req.headers['x-forwarded-for'].split(',')[0];
    console.log('find short url', req.body);
    const { ipInfo } = req;
    // fetchShortUrl(short, res);
    res.send({ request: ipInfo });
 });

 module.exports = router;
