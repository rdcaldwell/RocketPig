const mongoose = require('mongoose');

const GamesSchema = new mongoose.Schema({
    //person
    /*
    itemName
    description
    tags
    price
    quantity
    itemSpecific - removed
    postedDate
    */
   personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
   itemName: String,
   description: String,
   tags: String,
   price: Number,
   sold: Boolean,
   postedDate: Date,
   image: { data: Buffer, contentType: String },
});

mongoose.model('Games', GamesSchema);
