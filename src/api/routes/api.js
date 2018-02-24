const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const JWT = require('express-jwt');
const AUTH = JWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
const ASYNC = require('async');
const GRAPH = require('node-all-paths');
const MONGOOSE = require('mongoose');
const CUSTOMER = MONGOOSE.model('Customer');
const FLIGHT = MONGOOSE.model('Flight');
const BOOKING = MONGOOSE.model('Booking');
const TICKET = MONGOOSE.model('Ticket');

const CTRL_PROFILE = require('../controllers/profile');
const CTRL_AUTH = require('../controllers/authentication');

const stripe = require("stripe")(process.env.STRIPE_SK);

// profile
ROUTER.get('/profile', AUTH, CTRL_PROFILE.profileRead);

// authentication
ROUTER.post('/register', CTRL_AUTH.register);
ROUTER.post('/login', CTRL_AUTH.login);

ROUTER.post('/checkout', (req, res) => {
  stripe.charges.create({
    amount: req.body.amount*100,
    currency: "usd",
    source: req.body.token.id, // obtained with Stripe.js
    description: req.body.description
  }, function(err, charge) {
    if (err) res.json(err);
    else res.json(charge);
  });
});

ROUTER.get('/username-validation/:id', (req, res) => {
  var jsonData = { found: false };

  CUSTOMER.findOne({ username: req.params.id }, function (err, customer) {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
});

ROUTER.get('/email-validation/:id', (req, res) => {
  var jsonData = { found: false };
  
  CUSTOMER.findOne({ email: req.params.id }, function (err, customer) {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
});

ROUTER.get('/flight/new', (req, res) => {
  var flight = new FLIGHT();
  flight.departure = 'CLT';
  flight.arrival = 'RSW';
  flight.departureDate = new Date('February 28, 2018 15:50:00');
  flight.arrivalDate = new Date('February 28, 2018 17:25:00');
  flight.number = 2222;
  flight.distance = 696.83;
  flight.seatsLeft = 25;
  flight.price = 110;
  flight.airline = "American Airlines";
  flight.save(function(err) {
    res.json(`${flight.number} saved`);
  });
});

ROUTER.post('/booking/new', (req, res) => {
  var booking = new BOOKING();
  booking.customerId = req.body.customerId;
  booking.tickets = req.body.tickets;
  booking.bookingDate = req.body.date;
  booking.total = req.body.total;
  booking.save(function(err) {
    res.json(booking._id);
  });
});

ROUTER.post('/tickets/new', (req, res) => {
  var ticketIds = [];
  ASYNC.forEachOf(req.body, function(ticket, index, callback) {
    var newTicket = new TICKET();
    newTicket.flight = ticket.flightId;
    newTicket.travelClass = ticket.travelClass;
    newTicket.fareClass = ticket.fareClass;
    newTicket.save(function(err) {
      ticketIds.push(newTicket._id);
      callback();
    });
  }, function(err) {
    if (err) console.log(err);
    res.json(ticketIds)
  });
});

ROUTER.get('/booking/:id', (req, res) => {
  BOOKING.find({ _id: req.params.id }, function(err, booking) {
    res.json(booking[0]);
  });
});

ROUTER.get('/bookings/customer/:id', (req, res) => {
  BOOKING.find({ customerId: req.params.id }, function(err, bookings) {
    res.json(bookings);
  });
});

ROUTER.get('/booking/:id', (req, res) => {
  BOOKING.find({ _id: req.params.id }, function(err, booking) {
    res.json(booking[0]);
  });
});

ROUTER.get('/ticket/:id', (req, res) => {
  TICKET.find({ _id: req.params.id }, function(err, ticket) {
    res.json(ticket[0]);
  });
});

ROUTER.get('/flight/:id', (req, res) => {
  FLIGHT.find({ _id: req.params.id }, function(err, flight) {
    if (err) return;
    else res.json(flight[0]);
  });
});

ROUTER.get('/flights', (req, res) => {
  const ROUTE = new GRAPH();
  const flightPackages = [];
  FLIGHT.find({ }, function(err, flights) {
    ASYNC.forEachOf(flights, function(flight, index, callback) {
      var arrivals = {}
      FLIGHT.find({ departure: flight.departure }, function(err, departureflights) {
        ASYNC.forEachOf(departureflights, function(departureflight, index2, callback2) {
          arrivals[departureflight.arrival] = departureflight.distance;
          callback2();
        }, function(err) {
          if (err) return;
          ROUTE.addNode(flight.departure, arrivals);
        });
        callback();
      });
    }, function(err) {
      if (err) return;
      var allPaths = ROUTE.path('DFW', 'RSW');
      ASYNC.forEachOf(allPaths, function(package, i, callback) {
        const flightPackage = [];
        ASYNC.forEachOf(package, function(flight, j, callback2) {
          FLIGHT.find({ departure: package[j], arrival: package[j+1]}, function(err, edge) {
            if (edge[0] !== undefined) flightPackage.push(edge[0]);
            callback2();
          });
        }, function(err) {
          if (err) return;
          flightPackages.push(flightPackage);
          callback();
        });
      }, function(err) {
        if (err) return;
        res.json(flightPackages);
      });
    });
  });
});

module.exports = ROUTER;