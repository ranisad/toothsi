const route = require('express').Router();
const bodyParser = require('body-parser');

// Require routes
const Auth = require('./login')
const teachers = require('./teachers');
const students = require('./students');

// configure app to use bodyParser()
// this will let us get the data from a POST
route.use(bodyParser.urlencoded({ extended: true }));
route.use(bodyParser.json());

route.use((req, res, next) => {
  // do logging
  console.log(`Resource requested: ${req.method} ${req.originalUrl}`);
  next(); // make sure we go to the next routes and don't stop here
});

route.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Hello world!' });
});

route.use('/', Auth)
route.use('/teachers', teachers);
route.use('/students', students);

module.exports = route;