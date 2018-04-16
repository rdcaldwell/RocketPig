/* eslint no-param-reassign: 0, no-floating-decimal:0, no-console: 0 */
const EXPRESS = require('express');
const JWT = require('express-jwt');
const stripe = require('stripe')(process.env.STRIPE_SK);
const ASYNC = require('async');
const GRAPH = require('node-all-paths');
const MONGOOSE = require('mongoose');
const CTRL_AUTH = require('../controllers/authentication');

const CUSTOMER = MONGOOSE.model('Customer');
const FLIGHT = MONGOOSE.model('Flight');
const BOOKING = MONGOOSE.model('Booking');
const TICKET = MONGOOSE.model('Ticket');
const REWARD = MONGOOSE.model('Reward');
const GAME = MONGOOSE.model('Games');
const MESSAGE = MONGOOSE.model('Message');

const ROUTER = EXPRESS.Router();
const AUTH = JWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

/* Authentication Controllers */
ROUTER.get('/profile', AUTH, CTRL_AUTH.profileRead);
ROUTER.post('/register', CTRL_AUTH.register);
ROUTER.post('/login', CTRL_AUTH.login);
ROUTER.get('/user/:id', CTRL_AUTH.getUserByid);
ROUTER.get('/username-validation/:id', CTRL_AUTH.validateUsername);
ROUTER.get('/email-validation/:id', CTRL_AUTH.validateEmail);
ROUTER.post('/reward-validation/', CTRL_AUTH.validateReward);

/* Stripe checkout */
ROUTER.post('/checkout', (req, res) => {
  // Creates stripe charge
  stripe.charges.create({
    amount: req.body.amount * 100,
    currency: 'usd',
    // From Stripe.js client side
    source: req.body.token.id,
    description: req.body.description,
  }, (err, charge) => {
    if (err) res.json(err);
    else res.json(charge);
  });
});

ROUTER.get('/game/img/:id', (req, res) => {
  GAME.findOne({
    _id: req.params.id,
  }, (err, game) => {
    if (err) res.send(err);
    else {
      const img = Buffer.from(game.image.data, 'base64');
      res.send(img);
    }
  });
});

ROUTER.get('/games', (req, res) => {
  GAME.find({
    sold: false,
  }, (err, games) => {
    res.json(games);
  });
});

ROUTER.post('/game/new', (req, res) => {
  const game = new GAME();
  game.personId = req.body.customerId;
  game.itemName = req.body.itemName;
  game.description = req.body.description;
  game.tags = req.body.tags;
  game.price = req.body.price;
  game.sold = false;
  game.bookingId = null;
  game.postedDate = new Date();
  game.soldDate = null;
  game.image.data = req.body.image;
  game.image.contentType = 'image/png';
  game.save((err) => {
    if (err) res.json(err);
    else res.json(`${game.itemName} saved`);
  });
});

/* Creates new booking */
ROUTER.post('/booking/new', (req, res) => {
  // Creates new booking document on data passed from client side
  const booking = new BOOKING();
  booking.customerId = req.body.customerId;
  // Reward code is null if it is blank
  booking.rewardCode = (req.body.rewardCode === '') ? null : req.body.rewardCode;
  booking.tickets = req.body.tickets;
  booking.games = req.body.games;
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
  // If customer is valid
  if (req.body.customerId) {
    // Customer database query on passed customerId
    CUSTOMER.findOne({
      _id: booking.customerId,
    }, (customerErr, customer) => {
      // Increments customer's miles
      customer.miles += booking.totalMiles;
      // If the customer does not have an active reward
      if (!customer.hasActiveReward) {
        // Decrement miles to next reward
        customer.milesToNextReward -= booking.totalMiles;
        // If the customer has passed the reward miles threshold
        if (customer.milesToNextReward <= 0) {
          // Create new reward
          const reward = new REWARD();
          reward.used = false;
          // Bind reward to customer
          customer.rewardId = reward._id;
          customer.hasActiveReward = true;
          // Reset mileage threshold
          customer.milesToNextReward = 10000;
          // Save documents to db
          reward.save();
          customer.save();
        }
        // If customer reward code matches passed reward code
      } else if (customer.rewardId.toString() === req.body.rewardCode) {
        // Reward database query on passed rewardCode
        REWARD.findOne({
          _id: req.body.rewardCode,
        }, (rewardErr, usedReward) => {
          // If code is not used
          if (!usedReward.used) {
            // Set code to used
            usedReward.used = true;
            // Remove active reward from customer
            customer.hasActiveReward = false;
            // Remove reward code
            customer.rewardId = null;
          }
          // Save documents to db
          usedReward.save();
          customer.save();
        });
      }
      // Save documents to db
      customer.save();
    });
  }

  ASYNC.forEachOf(req.body.tickets, (ticketId, index, callback) => {
    // Ticket database query on ticket id
    TICKET.findOne({
      _id: ticketId,
    }, (ticketErr, ticket) => {
      if (ticketErr) res.json(ticketErr);
      else {
        // Flight database query on ticket's flight id
        FLIGHT.findOne({
          _id: ticket.flight,
        }, (flightErr, flight) => {
          if (flightErr) res.json(flightErr);
          else {
            // Remove seats from flight
            flight.seatsLeft -= 1;
            flight.save();
          }
        });
      }
    });
    callback();
  }, (ticketsLoopErr) => {
    if (ticketsLoopErr) res.json(ticketsLoopErr);
    ASYNC.forEachOf(req.body.games, (gameId, index, callback) => {
      // Ticket database query on ticket id
      GAME.findOne({
        _id: gameId,
      }, (gameErr, game) => {
        if (gameErr) res.json(gameErr);
        else {
          game.sold = true;
          game.bookingId = booking._id;
          game.soldDate = new Date();
          game.save();

          const message = new MESSAGE();
          message.sellerId = game.personId;
          message.bookingId = booking._id;
          message.body = `Your game ${game.itemName} has been sold!`;
          message.sentDate = new Date();
          message.save();
        }
      });
      callback();
    }, (gamesLoopErr) => {
      if (gamesLoopErr) console.log(gamesLoopErr);
      // Save booking documents to db
      booking.save(() => {
        res.json(booking._id);
      });
    });
  });
});

// Create new ticket
ROUTER.post('/tickets/new', (req, res) => {
  const ticketIds = [];
  // Asynchronous for loop for tickets passed in post request
  ASYNC.forEachOf(req.body, (ticket, index, callback) => {
    // Creates new ticket
    const newTicket = new TICKET();
    newTicket.flight = ticket.flightId;
    newTicket.travelClass = ticket.travelClass;
    newTicket.fareClass = ticket.fareClass;
    // Save documents to db
    newTicket.save(() => {
      // Save ticket ids for booking object
      ticketIds.push(newTicket._id);
      callback();
    });
  }, (err) => {
    if (err) res.json(err);
    // Pass ticket ids back to client
    else res.json(ticketIds);
  });
});

/* Get booking by id */
ROUTER.get('/booking/:id', (req, res) => {
  // Booking database query on passed id
  BOOKING.find({
    _id: req.params.id,
  }, (err, booking) => {
    // Respond booking object back to client
    res.json(booking[0]);
  });
});

ROUTER.post('/seller/rating', (req, res) => {
  CUSTOMER.findOne({
    _id: req.body.id,
  }, (err, seller) => {
    seller.ratings.push(req.body.rating);
    seller.save();
    res.json(`${seller.username} rated ${req.body.rating} stars`);
  });
});

/* Get customer bookings by customerId */
ROUTER.get('/bookings/customer/:id', (req, res) => {
  // Booking database query on passed customerId
  BOOKING.find({
    customerId: req.params.id,
  }, (err, bookings) => {
    // Respond booking objects back to client
    res.json(bookings);
  });
});

/* Get tickets by id */
ROUTER.get('/ticket/:id', (req, res) => {
  // Ticket database query on passed id
  TICKET.find({
    _id: req.params.id,
  }, (err, ticket) => {
    // Respond ticket object back to client
    res.json(ticket[0]);
  });
});

/* Get tickets by id */
ROUTER.get('/game/:id', (req, res) => {
  // Ticket database query on passed id
  GAME.find({
    _id: req.params.id,
  }, (err, game) => {
    // Respond ticket object back to client
    res.json(game[0]);
  });
});

/* Get messages by seller id */
ROUTER.get('/messages/seller/:id', (req, res) => {
  // Message database query on passed id
  MESSAGE.find({
    sellerId: req.params.id,
  }, (err, messages) => {
    // Respond messages object back to client
    res.json(messages);
  });
});

/* Get tickets by id */
ROUTER.get('/games/seller/:id', (req, res) => {
  // Ticket database query on passed id
  GAME.find({
    personId: req.params.id,
    sold: true,
  }, (err, games) => {
    // Respond ticket object back to client
    res.json(games);
  });
});

/* Get flight by id */
ROUTER.get('/flight/:id', (req, res) => {
  // Flight database query on passed id
  FLIGHT.find({
    _id: req.params.id,
  }, (err, flight) => {
    if (err) res.json(err);
    // Respond flight object back to client
    else res.json(flight[0]);
  });
});

/* Get all flights */
ROUTER.get('/flights/all', (req, res) => {
  FLIGHT.find({}, (err, flights) => {
    if (err) res.json(err);
    else res.json(flights);
  });
});

/* Gets flight paths based on user search parameters */
ROUTER.post('/flights', (req, res) => {
  const searchParameters = req.body;
  /* Logic for booking round trip return flights.
   If the booking type is round trip and the departure flight has been booked */
  if (searchParameters.bookingType === 'RoundTrip' && searchParameters.firstBooked) {
    // Sets departure date as original return date
    searchParameters.departDate = searchParameters.returnDate;
    // Holds departure airport
    const temp = searchParameters.departure;
    // Sets departure airport as original destination
    searchParameters.departure = searchParameters.destination;
    // Sets destination airport as original departure
    searchParameters.destination = temp;
  }
  // For date query, searches full day (given day + 1)
  const lowerDateBounds = new Date(searchParameters.departDate);
  const upperDateBounds = new Date(searchParameters.departDate);
  upperDateBounds.setDate(upperDateBounds.getDate() + 1);
  // Route graph saves all flights with their paths
  const ROUTE = new GRAPH();
  const flightPackages = [];
  // Flight database query using given dates
  FLIGHT.find({
    departureDate: {
      $gte: lowerDateBounds,
      $lt: upperDateBounds,
    },
  }, (flightFindErr, flights) => {
    // Asynchronous for loop for all flights found on given day
    ASYNC.forEachOf(flights, (flight, index, callback) => {
      const arrivals = {};
      // Flight database query for all departure flights
      FLIGHT.find({
        departure: flight.departure,
      }, (departureFindErr, departureflights) => {
        // Asynchronous for loop for all flights departures
        ASYNC.forEachOf(departureflights, (departureflight, index2, callback2) => {
          // Graph does not include flights with no seats
          if (departureflight.seatsLeft !== 0) {
            /* Builds arrival JavaScript object with the distance
             to the arrival location from departure */
            arrivals[departureflight.arrival] = departureflight.distance;
          }
          callback2();
        }, (departureLoopErr) => {
          if (departureLoopErr) return;
          /* Adds node to route graph with all destinations with their distances
           coming from a particular departure */
          ROUTE.addNode(flight.departure, arrivals);
        });
        callback();
      });
    }, (flightLoopErr) => {
      if (flightLoopErr) return;
      // All the paths from the searched departure to the searched destination from route graph
      const allPaths = ROUTE.path(searchParameters.departure, searchParameters.destination);
      // Asynchronous for loop of all paths graph
      ASYNC.forEachOf(allPaths, (flightPackage, i, callback) => {
        const edges = [];
        /* Asynchronous for loop for each flight package in the path.
         * A flight package is the path from the searched departure to destination. This could be
         * RSW -> DFW or RSW -> CLT -> DFW. RSW -> DFW contains one flight while RSW -> CLT
         * and CLT -> DFW is two flights in the package */
        ASYNC.forEachOf(flightPackage, (flight, j, callback2) => {
          // Flight database query to get flight information of flights in flight package
          FLIGHT.find({
            // Current flight in package using j index
            departure: flightPackage[j],
            // Next flight in package
            arrival: flightPackage[j + 1],
          }, (packageFindErr, edge) => {
            /* Edge in graph is a flight, the connection between two points in the graph.
              If the edge is defined, add it to array */
            if (edge[0] !== undefined) edges.push(edge[0]);
            callback2();
          });
        }, (packageLoopErr) => {
          if (packageLoopErr) return;
          // Edges are the flights in a package, add them to packages array
          flightPackages.push(edges);
          callback();
        });
      }, (pathLoopErr) => {
        if (pathLoopErr) return;
        // Return all packages to client
        res.json(flightPackages);
      });
    });
  });
});

module.exports = ROUTER;
