const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer');

passport.use(new LocalStrategy({
  usernameField: 'username',
}, (username, password, done) => {
  Customer.findOne({
    username: username,
  }, (err, customer) => {
    if (err) {
      return done(err);
    }
    if (!customer) {
      return done(null, false, {
        message: 'User not found',
      });
    }
    if (!customer.validPassword(password)) {
      return done(null, false, {
        message: 'Password is wrong',
      });
    }
    return done(null, customer);
  });
}));
