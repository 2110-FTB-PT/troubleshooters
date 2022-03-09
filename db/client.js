const { Client } = require('pg')
const CONNECTION_STRING = process.env.DATABASE_URL || "postgres://localhost:5432/shopper-dev"
const client = new Client(CONNECTION_STRING)

module.exports = client;