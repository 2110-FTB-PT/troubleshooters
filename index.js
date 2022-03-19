require('dotenv').config();
// This is the Web Server
const express = require('express');
const server = express();

// bring in the DB connection
const { client } = require('./db');

// connect to the server
const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  console.log(`Server is listening on http://localhost:${PORT}/api`);
  try {
    await client.connect();
    console.log('Database is opened up!');
  } catch (error) {
    console.error('Something went wrong in the database startup:', error);
  }
});

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
const cors = require('cors');
server.use(cors());

// create logs for everything
const morgan = require('morgan');
server.use(morgan('dev'));

// handle application/json requests
server.use(express.json());

// here's our static files
const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));

// here's our API
server.use('/api', require('./api'));

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Error handling: 404 errors
server.use((req, res, next) => {
  res.status(404).send({
    message: "Page Not Found"
  });
});

//Error handling: 500 errors unless specific 4XX code is given
server.use(({ name, message }, req, res, next) => {
  if (res.statusCode < 400 || res.statusCode >= 500) {
    res.status(500);
  }
  res.send({
    name,
    message
  });
});

// export server and handle for routes/*.test.js
module.exports = { server };