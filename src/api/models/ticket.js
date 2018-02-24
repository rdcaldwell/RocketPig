var mongoose = require( 'mongoose' );

var TicketSchema = new mongoose.Schema({
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    travelClass: String,
    fareClass: String,
});

mongoose.model('Ticket', TicketSchema);