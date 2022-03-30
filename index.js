require("dotenv").config();
// This is the Web Server
const express = require("express");
const server = express();

// bring in the DB connection
const { client } = require("./db");

// connect to the server
const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  console.log(`Server is listening on http://localhost:${PORT}/api`);
  try {
    await client.connect();
    console.log("Database is opened up!");
  } catch (error) {
    console.error("Something went wrong in the database startup:", error);
  }
});

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
const cors = require("cors");
server.use(cors());

// create logs for everything
const morgan = require("morgan");
server.use(morgan("dev"));

// handle application/json requests
server.use(express.json());

// handle customer payment at checkout
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, {priceInCents: 1000, name: "In Keeping Secrets Of Silent Earth: 3"}],
  [2, {priceInCents: 1599, name: "always EP"}],
  [3, {priceInCents: 1499, name: "My Way"}],
  [4, {priceInCents: 1299, name: "Live at the Apollo"}],
  [5, {priceInCents: 1299, name: "Let It Bleed"}],
  [6, {priceInCents: 1599, name: "All My Friends We're Glorious"}],
  [7, {priceInCents: 1099, name: "Innervisions"}],
  [8, {priceInCents: 1499, name: "Nevermind"}],
  [9, {priceInCents: 1399, name: "Purple Rain"}],
  [10, {priceInCents: 1499, name: "Thriller"}],
  [11, {priceInCents: 1099, name: "Cold Spring Harbor"}],
  [12, {priceInCents: 1199, name: "Pet Sounds"}],
  [13, {priceInCents: 1299, name: "The Dark Side of the Moon"}],
  [14, {priceInCents: 1299, name: "Ready to Die"}],
  [15, {priceInCents: 1599, name: "The Chronic"}],
  [16, {priceInCents: 1299, name: "Legend"}],
  [17, {priceInCents: 1499, name: "Abbey Road"}],
  [18, {priceInCents: 1299, name: "Back to Black"}],
  [19, {priceInCents: 1499, name: "Songs in the Key of Life"}]
])

// here's our static files
const path = require("path");
server.use(express.static(path.join(__dirname, "build")));

// here's our API
server.use("/api", require("./api"));

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//Error handling: 500 errors unless specific 4XX code is given
server.use(({ name, message }, req, res, next) => {
  if (res.statusCode < 400 || res.statusCode >= 500) {
    res.status(500);
  }
  res.send({
    name,
    message,
  });
});

// export server and handle for routes/*.test.js
module.exports = { server };
