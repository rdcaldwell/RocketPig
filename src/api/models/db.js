var mongoose = require('mongoose');
var db = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds229458.mlab.com:29458/rocketpig`

mongoose.connect(db);

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + db);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

require('./customer');
require('./booking');
require('./flight');
require('./reward');
require('./ticket');