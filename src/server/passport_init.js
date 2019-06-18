//Required modules attachment
var mongoose = require('mongoose');
var User = mongoose.model('user');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var secret = 'CampKGurgaonSecretkey';
var token = '';

//Export function
module.exports = function(passport) {

  //    User serialization
  passport.serializeUser((user, done) => {
    console.log("serial");
    // console.log(user);
    if(user.local.username) {
      console.log('serializing user:', user.local.username);
      done(null, user._id);
    }
  });

  //    User deserialization
  passport.deserializeUser((id, done) => {
        
    User.findById(id, (err, user) => {
      console.log("deserializing user", user);
      if(err) {
        done(500,err);
      }

      else if(user) {
        if(user.local.username) {
          token = jwt.sign({id: user._id, username: user.local.username, email: user.local.email}, secret, {expiresIn: '24h'});
        }
        done(err, user);
      }
      else {
        token = null;
      }
    });
  });


  //    Local login
  passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  ((req, username, password, done) => {
        
    User.findOne({'local.username': username},              
            
      (err, user) => {
            
        if(err) {
          return done(err);
          console.log(err);
        }
        else if(!user) {
          console.log('Username or Password Invalid');
          req.session.message = 'Username or Password Invalid';
          return done(null, false);
        }
        else if(!isValidPassword(user, password)) {
          console.log('Username or Password Invalid');
          req.session.message = 'Username or Password Invalid';
          return done(null, false);
        }  
        else {
          console.log("returning user", req.session);
          return done(null, user);
        }
      });
  }))
  );
    
  //    Passport Local Signup
  passport.use('signup', new localStrategy({
    passReqToCallback : true
        
  }, ((req, username, password, done) => {
    console.log(username);
    console.log("username");
    User.findOne({$or: [{'local.username': username}, {'local.email': req.body.email}]},
                        
      (err, user) => {
                
        if(err) {
          console.log("Error in signup");
          return done(err);
        }
        if(user) {
          if(user.local.username === username) {
            req.session.message = 'Username already exist!';
            return done(null, false);
          }
          else {
            req.session.message = 'This email is already registered!';
            return done(null, false);
          }
        }
        else {
          var newuser = new User();
                        
          newuser.local.name = req.body.name;
          newuser.local.username = username;
          newuser.local.email = req.body.email;
          newuser.local.password = createHash(password);
          console.log(newuser);
          newuser.save(function(err) {
            if(err) {
              console.log("Error in saving user");
              throw err;
            } 
            else {
              console.log(username + ' saved successfully');
              return done(null, newuser);
                        
            }
          });
        }
                    
      });
  }))
  );
    
  //    Hash function for password encryption
  var createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
    
  //    Function to check if password provided is correct
  var isValidPassword = function(user, password) {
    return bcrypt.compareSync(password, user.local.password);
  }       

}