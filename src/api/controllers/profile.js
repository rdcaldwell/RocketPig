var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

module.exports.profileRead = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Customer.findById(req.payload._id).exec(function(err, customer) {
        res.status(200).json(customer);
    });
  }
};