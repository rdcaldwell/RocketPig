var mongoose = require( 'mongoose' );

var RewardSchema = new mongoose.Schema({
    rewardCode: String,
    used: Boolean,
});

mongoose.model('Reward', RewardSchema);