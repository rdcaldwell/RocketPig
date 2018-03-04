/* eslint no-console: 0 */
const mongoose = require('mongoose');

const db = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds229458.mlab.com:29458/rocketpig`;
// const db = 'mongodb://localhost:27017';

mongoose.connect(db);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${db}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

require('./customer');
require('./booking');
require('./flight');
require('./reward');
require('./ticket');
