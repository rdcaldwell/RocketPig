const mongoose = require('mongoose');

const Customer = mongoose.model('Customer');

module.exports.profileRead = (req, res) => {
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile',
    });
  } else {
    Customer.findById(req.payload._id).exec((err, customer) => {
      res.status(200).json(customer);
    });
  }
};
