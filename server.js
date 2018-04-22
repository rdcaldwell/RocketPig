/* eslint prefer-template: 0, no-console: 0 */
require('dotenv').config();
const EXPRESS = require('express');
const PATH = require('path');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const passport = require('passport');

const APP = EXPRESS();
const PORT = process.env.PORT || '3333';

require('./src/api/models/db');
require('./src/api/config/passport');
const API = require('./src/api/routes/api');

APP.use(BODY_PARSER.json());
APP.use('/api', API);
APP.use(BODY_PARSER.urlencoded({
  extended: false,
}));
APP.use(passport.initialize());

APP.set('port', PORT);

APP.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
APP.use('/app/*', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'dist/index.html'));
});

HTTP.createServer(APP).listen(PORT, () => console.log(`API running on localhost:${PORT}`));

setInterval(() => {
  HTTP.get('http://rocketpig.herokuapp.com');
  console.log('Pinging heroku...');
}, 300000);
