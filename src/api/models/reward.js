const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  used: Boolean,
});

mongoose.model('Reward', RewardSchema);
