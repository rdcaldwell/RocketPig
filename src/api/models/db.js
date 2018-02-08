var mongoose = require('mongoose');
var db = 'mongodb://admin:password@ds229458.mlab.com:29458/rocketpig';

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

require('./customers');