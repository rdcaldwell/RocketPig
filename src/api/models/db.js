var mongoose = require('mongoose');
var db = 'mongodb://admin:password@ds229458.mlab.com:29458/rocketpig';
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

mongoose.connect(db);

mongoose.connection.on('connected', function() {
    logger.info('Mongoose connected to ' + db);
});

mongoose.connection.on('error', function(err) {
    logger.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    logger.info('Mongoose disconnected');
});

require('./customers');