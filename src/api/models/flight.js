const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  departure: String,
  arrival: String,
  departureDate: Date,
  arrivalDate: Date,
  number: String,
  distance: Number,
  seatsLeft: Number,
  price: Number,
  airline: String,
});

mongoose.model('Flight', FlightSchema);
