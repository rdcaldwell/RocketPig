var passport = require('passport');
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  var customer = new Customer();
  customer.username = req.body.username;
  customer.email = req.body.email;
  customer.phoneNumber = req.body.phoneNumber;
  customer.firstName = req.body.firstName;
  customer.lastName = req.body.lastName;
  customer.setPassword(req.body.password);
  customer.save(function(err) {
    var token;
    token = customer.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
  console.log(customer.username + " registered");
};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, customer, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(customer){
      token = customer.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};