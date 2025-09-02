"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;
const _MAX_CONN_PER_CORE = 5;
const _KB = 1024;

// count connections
const countConnect = () => {
  const count = mongoose.connections.length;
  console.log(`Number of connections to MongoDB: ${count}`);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = _MAX_CONN_PER_CORE * numCores;

    console.log("Active connections:", numConnection);
    console.log(`Memory Usage: ${memoryUsage / _KB / _KB} MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected!");
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
