var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Url = mongoose.model('url');
var Visitors = mongoose.model('visitors');
var VisitorsList = mongoose.model('visitorList');

function fetchShortUrl(short) {
    console.log('short find url', short);
    return new Promise((resolve, reject) => {
        Url.findOne({ short }).populate('visitor').exec((err, urlObj) => {
            console.log('fetch url link', urlObj);
            if (err) {
                resolve({ url: null, message: 'Error in processing' });
            } else if (urlObj) {
                const fullUrl = urlObj;
                resolve({ url: fullUrl });
            } else {
                resolve({ url: null, message: 'Url does not exist' });
            }
        });
    });
 }

router.route('/')
 .post(async (req, res) => {
    const { short, visitorInfo } = req.body;
    const urlObj = await fetchShortUrl(short);
    const { url } = urlObj;
    // console.log('find short url', req.body);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { ipInfo } = req;

    if (url) {
        // console.log('send url to user', url);
        res.send({ url: url.url });
        const visitor = new Visitors();
        visitor.ip = ip;
        visitor.city = ipInfo.city;
        visitor.country = ipInfo.country;
        visitor.osName = visitorInfo.osName || '';
        visitor.browserName = visitorInfo.browserName || '';
        visitor.mobileVendor = visitorInfo.mobileVendor || '';

        visitor.save((err, newVisitor) => {
            if (!err) {
                // console.log('error: user info cannot be saved');
                if (url.visitor) {
                    VisitorsList.findById(url.visitor._id, (errorr, urlVisitor) => {
                        if (!errorr) {
                            urlVisitor.list.push(newVisitor);
                            urlVisitor.save((error, saveVisitorList) => {
                                if (!error) {
                                    console.log('save url cisitor list', saveVisitorList);
                                }
                            });
                        }
                    });
                } else {
                    const visitorList = new VisitorsList();
                    visitorList.list.push(visitor);
                    visitorList.save((error, newList) => {
                        if (!error) {
                            // console.log('new visitor list created', newList);
                            url.visitor = newList;
                            // console.log('save url in db0', url);
                            Url.findOneAndUpdate({ _id: url._id }, url, { useFindAndModify: false }, (errorr, savedObj) => {
                                if (errorr) {
                                    // console.log('error saving url', err);
                                } else {
                                    // console.log('url saved', savedObj);
                                }
                            });
                        }
                    });
                }
            }
        });

    } else {
        console.log('url does not exist');
        res.send({ url: null });
    }
 });

 module.exports = router;
