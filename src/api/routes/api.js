var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/username-validation/:id', (req, res) => {
  var jsonData = { found: false };

  Customer.findOne({ username: req.params.id }, function (err, customer) {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
});

router.get('/email-validation/:id', (req, res) => {
  var jsonData = { found: false };
  
  Customer.findOne({ email: req.params.id }, function (err, customer) {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
});

module.exports = router;