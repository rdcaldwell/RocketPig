const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Games' }],
  rewardCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
  bookingType: String,
  bookingDate: Date,
  bookingDeparture: String,
  bookingDestination: String,
  total: String,
  totalMiles: Number,
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  city: String,
  state: String,
  zip: Number,
});

mongoose.model('Booking', BookingSchema);
