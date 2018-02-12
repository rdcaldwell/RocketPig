const EXPRESS = require('express');
const PATH = require('path');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const SERVER = EXPRESS();
const PORT = process.env.PORT || '3333';
const passport = require('passport');

require('./src/api/models/db');
require('./src/api/config/passport');
const API = require('./src/api/routes/api');

SERVER.use(BODY_PARSER.json());
SERVER.use(BODY_PARSER.urlencoded({ extended: false }));
SERVER.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
SERVER.use(passport.initialize());
SERVER.use('/api', API);
SERVER.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

SERVER.get('*', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'dist/index.html'));
});
SERVER.set('port', PORT);

HTTP.createServer(SERVER).listen(PORT, () => console.log("API running on localhost: " + PORT));