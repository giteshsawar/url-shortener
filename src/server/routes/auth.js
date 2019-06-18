var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret = 'CampK12LiveSecretKey';

module.exports = passport => {
    
    router.get('/success', (req, res) => {
       res.send({state: 'success', user: req.user ? req.user : null}); 
    });
   
    router.get('/failure', (req, res) => {
       res.send({state: 'failure', user: null, message: req.session.message}); 
    });
    
    router.get('/logsuccess', (req, res) => {
        res.redirect('/success/' + req.user);
    });

    router.post('/login', passport.authenticate('login', {
        
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));
    
    router.post('/signup', passport.authenticate('signup', {
        
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));
    
    router.get('/logout', (req, res) => {
        
        req.logout();
        res.redirect('/');
    });

    return router;
}