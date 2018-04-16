const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  body: String,
  sentDate: String,
});

mongoose.model('Message', MessageSchema);
