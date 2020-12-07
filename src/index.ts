const mongo = require('./DAL/index');
require('dotenv').config();

(async function() {
    await mongo.createMongoConnection();
})()

const express = require('express');
const routes = require('./routes');
const auth = require('./middleware/auth');

const app = express();

const port = process.env.PORT || 8080; // set our port
app.use(auth.validateAuthentication)
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    success: false,
    message: err.message || 'An error occured.',
    errors: err.error || [],
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found.' });
});

// Start the server
app.listen(port);

console.log(`Server started on port ${port}`);