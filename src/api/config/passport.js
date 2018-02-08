var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  function(username, password, done) {
    Customer.findOne({ username: username }, function (err, customer) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!customer) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!customer.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, customer);
    });
  }
));