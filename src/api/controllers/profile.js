const mongoose = require('mongoose');

const Customer = mongoose.model('Customer');

// Authenticates profile for user only
module.exports.profileRead = (req, res) => {
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile',
    });
  } else {
    // Finds customer using token id
    Customer.findById(req.payload._id).exec((err, customer) => {
      res.status(200).json(customer);
    });
  }
};
