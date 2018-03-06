const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer');

// Passport module for authentication
passport.use(new LocalStrategy({
  usernameField: 'username',
}, (username, password, done) => {
  // Finds customer from username
  Customer.findOne({
    username: username,
  }, (err, customer) => {
    if (err) {
      return done(err);
    }
    // If user is not found
    if (!customer) {
      return done(null, false, {
        message: 'User not found',
      });
    }
    // Validates customer password
    if (!customer.validPassword(password)) {
      return done(null, false, {
        message: 'Password is wrong',
      });
    }
    // Return authenticated customer
    return done(null, customer);
  });
}));
