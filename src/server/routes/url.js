var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Url = mongoose.model('url');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function fetchShortUrl(url, res) {
    Url.find({ short: url }, (err, urlObj) => {
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
 
router.route('/generateShortUrl')
 .post((req, res) => {
    console.log('generate url', req.body);
     const { url } = req.body;
     const short = makeid(8);
     const urlObj = new Url({ url, short });
     Url.find({ url }, (err, oldUrl) => {
         if (err) {
            res.send({ url: null, message: 'Error in processing' });
         } else if (oldUrl.length > 0) {
             console.log('url already exist', oldUrl);
             res.send({ url: oldUrl, message: 'Short url already exist' });
         } else {
            urlObj.save((error, newUrl) => {
                if (error) {
                    res.send({ url: null, message: 'Error in processing' });
                }
                res.send({ url: newUrl, message: 'New short url generated' });
            });
         }
     })
     console.log('short url generated', url, short);
});

router.route('/fetchShortUrl')
    .post((req, res) => {
        const { url } = req.body;
        fetchShortUrl(url, res);
    });

module.exports = router;
