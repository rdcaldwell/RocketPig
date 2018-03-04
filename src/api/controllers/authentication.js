const passport = require('passport');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer');

module.exports.register = (req, res) => {
  const customer = new Customer();
  customer.username = req.body.username;
  customer.email = req.body.email;
  customer.phoneNumber = req.body.phoneNumber;
  customer.firstName = req.body.firstName;
  customer.lastName = req.body.lastName;
  customer.miles = 0;
  customer.milesToNextReward = 10000;
  customer.hasActiveReward = false;
  customer.rewardId = null;
  customer.setPassword(req.body.password);
  console.log(customer);
  customer.save(() => {
    res.status(200);
    res.json({
      token: customer.generateJwt(),
    });
  });
};

module.exports.login = (req, res) => {
  passport.authenticate('local', (err, customer, info) => {
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (customer) {
      res.status(200);
      res.json({
        token: customer.generateJwt(),
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};
