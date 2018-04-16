const passport = require('passport');
const mongoose = require('mongoose');

const CUSTOMER = mongoose.model('Customer');
const REWARD = mongoose.model('Reward');

// Creates new customer object
module.exports.register = (req, res) => {
  const customer = new CUSTOMER();
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
  customer.save(() => {
    res.status(200);
    res.json({
      token: customer.generateJwt(),
    });
  });
};

// Login user
module.exports.login = (req, res) => {
  // Authenticate using passport
  passport.authenticate('local', (err, customer, info) => {
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If customer is found
    if (customer) {
      // Return valid response
      res.status(200);
      res.json({
        token: customer.generateJwt(),
      });
    } else {
      // Return unauthorized response
      res.status(401).json(info);
    }
  })(req, res);
};

// Authenticates profile for user only
module.exports.profileRead = (req, res) => {
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile',
    });
  } else {
    // Finds customer using token id
    CUSTOMER.findById(req.payload._id).exec((err, customer) => {
      res.status(200).json(customer);
    });
  }
};

module.exports.getUserByid = (req, res) => {
  // Finds customer using  id
  CUSTOMER.findById(req.params.id).exec((err, customer) => {
    res.status(200).json(customer);
  });
};

/* Checks if username is taken */
module.exports.validateUsername = (req, res) => {
  // Retrun data if username is found
  const jsonData = {
    found: false,
  };
  // Customer database query on passed id
  CUSTOMER.findOne({
    username: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
};

/* Checks if email is taken */
module.exports.validateEmail = (req, res) => {
  // Retrun data if email is found
  const jsonData = {
    found: false,
  };
  // Customer database query on passed email
  CUSTOMER.findOne({
    email: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
};

/* Checks if reward code is valid */
module.exports.validateReward = (req, res) => {
  // Customer database query on passed customerId
  CUSTOMER.findOne({
    _id: req.body.customerId,
  }, (customerErr, customer) => {
    // Reward database query on passed rewardCode
    REWARD.findOne({
      _id: req.body.rewardCode,
    }, (rewardErr, reward) => {
      // Saves if the code has been used
      const isCodeUsed = reward.used;
      // If the code is not used and the customer's reward id matches the passed rewardCode
      if (!isCodeUsed && customer.rewardId.toString() === req.body.rewardCode) {
        res.json('Reward code applied successfully');
      } else {
        res.json('Reward code not valid');
      }
    });
  });
};
