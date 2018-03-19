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
}, {
  collection: 'flights',
});

mongoose.model('Flight', FlightSchema);
