const mongoose = require('mongoose');

const GamesSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  itemName: String,
  description: String,
  tags: String,
  price: Number,
  sold: Boolean,
  postedDate: Date,
  soldDate: Date,
  image: {
    data: Buffer,
    contentType: String,
  },
});

mongoose.model('Games', GamesSchema);
