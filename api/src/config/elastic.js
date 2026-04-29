// config/elastic.js

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTICSEARCH_ENDPOINT
});

module.exports = client;