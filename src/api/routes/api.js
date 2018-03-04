/* eslint no-param-reassign: 0, no-floating-decimal:0, no-console: 0 */
const EXPRESS = require('express');
const JWT = require('express-jwt');
const stripe = require('stripe')(process.env.STRIPE_SK);
const ASYNC = require('async');
const GRAPH = require('node-all-paths');
const MONGOOSE = require('mongoose');
const CTRL_PROFILE = require('../controllers/profile');
const CTRL_AUTH = require('../controllers/authentication');

const CUSTOMER = MONGOOSE.model('Customer');
const FLIGHT = MONGOOSE.model('Flight');
const BOOKING = MONGOOSE.model('Booking');
const TICKET = MONGOOSE.model('Ticket');
const REWARD = MONGOOSE.model('Reward');

const ROUTER = EXPRESS.Router();
const AUTH = JWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

/* User Authorization Controllers */
ROUTER.get('/profile', AUTH, CTRL_PROFILE.profileRead);
ROUTER.post('/register', CTRL_AUTH.register);
ROUTER.post('/login', CTRL_AUTH.login);

ROUTER.post('/checkout', (req, res) => {
  stripe.charges.create({
    amount: req.body.amount * 100,
    currency: 'usd',
    source: req.body.token.id, // obtained with Stripe.js
    description: req.body.description,
  }, (err, charge) => {
    if (err) res.json(err);
    else res.json(charge);
  });
});

ROUTER.get('/username-validation/:id', (req, res) => {
  const jsonData = {
    found: false,
  };

  CUSTOMER.findOne({
    username: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
});

ROUTER.get('/email-validation/:id', (req, res) => {
  const jsonData = {
    found: false,
  };

  CUSTOMER.findOne({
    email: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
});

ROUTER.post('/reward-validation/', (req, res) => {
  CUSTOMER.findOne({
    _id: req.body.customerId,
  }, (customerErr, customer) => {
    REWARD.findOne({
      _id: req.body.rewardCode,
    }, (rewardErr, reward) => {
      const isCodeUsed = reward.used;
      if (!isCodeUsed && customer.rewardId.toString() === req.body.rewardCode) {
        res.json('Reward code applied successfully');
      } else {
        res.json('Reward code not valid');
      }
    });
  });
});

ROUTER.get('/flight/new', (req, res) => {
  const flight = new FLIGHT();
  flight.departure = 'RSW';
  flight.arrival = 'DFW';
  flight.departureDate = new Date('March 3, 2018 12:50:00');
  flight.arrivalDate = new Date('March 3, 2018 14:25:00');
  flight.number = 2222;
  flight.distance = 1224.23;
  flight.seatsLeft = 25;
  flight.price = 100;
  flight.airline = 'American Airlines';
  flight.save(() => {
    res.json(`${flight.number} saved`);
  });
});

ROUTER.post('/booking/new', (req, res) => {
  const booking = new BOOKING();
  booking.customerId = req.body.customerId;
  booking.rewardCode = (req.body.rewardCode === '') ? null : req.body.rewardCode;
  booking.tickets = req.body.tickets;
  booking.bookingDate = req.body.date;
  booking.total = req.body.total;
  booking.totalMiles = req.body.totalMiles;
  booking.firstName = req.body.firstName;
  booking.lastName = req.body.lastName;
  booking.email = req.body.email;
  booking.address = req.body.address;
  booking.city = req.body.city;
  booking.state = req.body.state;
  booking.zip = req.body.zip;
  CUSTOMER.findOne({
    _id: booking.customerId,
  }, (customerErr, customer) => {
    customer.miles += booking.totalMiles;
    if (!customer.hasActiveReward) {
      customer.milesToNextReward -= booking.totalMiles;
      if (customer.milesToNextReward <= 0) {
        const reward = new REWARD();
        reward.used = false;
        customer.rewardId = reward._id;
        customer.hasActiveReward = true;
        customer.milesToNextReward = 10000;
        reward.save();
        customer.save();
      }
    } else if (customer.rewardId.toString() === req.body.rewardCode) {
      REWARD.findOne({
        _id: req.body.rewardCode,
      }, (rewardErr, usedReward) => {
        if (!usedReward.used) {
          usedReward.used = true;
          customer.hasActiveReward = false;
          customer.rewardId = null;
        }
        usedReward.save();
        customer.save();
      });
    }
    customer.save();
  });
  booking.save(() => {
    res.json(booking._id);
  });
});

ROUTER.post('/tickets/new', (req, res) => {
  const ticketIds = [];
  ASYNC.forEachOf(req.body, (ticket, index, callback) => {
    const newTicket = new TICKET();
    newTicket.flight = ticket.flightId;
    newTicket.travelClass = ticket.travelClass;
    newTicket.fareClass = ticket.fareClass;
    newTicket.save(() => {
      ticketIds.push(newTicket._id);
      callback();
    });
  }, (err) => {
    if (err) res.json(err);
    else res.json(ticketIds);
  });
});

ROUTER.get('/booking/:id', (req, res) => {
  BOOKING.find({
    _id: req.params.id,
  }, (err, booking) => {
    res.json(booking[0]);
  });
});

ROUTER.get('/bookings/customer/:id', (req, res) => {
  BOOKING.find({
    customerId: req.params.id,
  }, (err, bookings) => {
    res.json(bookings);
  });
});

ROUTER.get('/booking/:id', (req, res) => {
  BOOKING.find({
    _id: req.params.id,
  }, (err, booking) => {
    res.json(booking[0]);
  });
});

ROUTER.get('/ticket/:id', (req, res) => {
  TICKET.find({
    _id: req.params.id,
  }, (err, ticket) => {
    res.json(ticket[0]);
  });
});

ROUTER.get('/flight/:id', (req, res) => {
  FLIGHT.find({
    _id: req.params.id,
  }, (err, flight) => {
    if (err) res.json(err);
    else res.json(flight[0]);
  });
});

ROUTER.post('/flights', (req, res) => {
  const searchParameters = req.body;
  if (searchParameters.bookingType === 'RoundTrip' && searchParameters.firstBooked) {
    searchParameters.departDate = searchParameters.returnDate;
    const temp = searchParameters.departure;
    searchParameters.departure = searchParameters.destination;
    searchParameters.destination = temp;
  }
  const lowerDateBounds = new Date(searchParameters.departDate);
  const upperDateBounds = new Date(searchParameters.departDate);
  upperDateBounds.setDate(upperDateBounds.getDate() + 1);
  const ROUTE = new GRAPH();
  const flightPackages = [];
  FLIGHT.find({
    departureDate: {
      $gte: lowerDateBounds,
      $lt: upperDateBounds,
    },
  }, (flightFindErr, flights) => {
    ASYNC.forEachOf(flights, (flight, index, callback) => {
      const arrivals = {};
      FLIGHT.find({
        departure: flight.departure,
      }, (departureFindErr, departureflights) => {
        ASYNC.forEachOf(departureflights, (departureflight, index2, callback2) => {
          arrivals[departureflight.arrival] = departureflight.distance;
          callback2();
        }, (departureLoopErr) => {
          if (departureLoopErr) return;
          ROUTE.addNode(flight.departure, arrivals);
        });
        callback();
      });
    }, (flightLoopErr) => {
      if (flightLoopErr) return;
      const allPaths = ROUTE.path(searchParameters.departure, searchParameters.destination);
      ASYNC.forEachOf(allPaths, (flightPackage, i, callback) => {
        const edges = [];
        ASYNC.forEachOf(flightPackage, (flight, j, callback2) => {
          FLIGHT.find({
            departure: flightPackage[j],
            arrival: flightPackage[j + 1],
          }, (packageFindErr, edge) => {
            if (edge[0] !== undefined) edges.push(edge[0]);
            callback2();
          });
        }, (packageLoopErr) => {
          if (packageLoopErr) return;
          flightPackages.push(edges);
          callback();
        });
      }, (pathLoopErr) => {
        if (pathLoopErr) return;
        res.json(flightPackages);
      });
    });
  });
});

module.exports = ROUTER;
