var mongoose = require( 'mongoose' );

var BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  rewardCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
  bookingType: String,
  bookingDate: Date,
  bookingDeparture: String,
  bookingDestination: String,
  total: String
});

mongoose.model('Booking', BookingSchema);