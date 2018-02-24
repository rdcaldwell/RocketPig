var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var CustomerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
  miles: Number,
  hash: String,
  salt: String
});

CustomerSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};
  
CustomerSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};
  
CustomerSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      user: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
  
mongoose.model('Customer', CustomerSchema);