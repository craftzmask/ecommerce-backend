"use strict";

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

const { StatusCodes, ReasonPhrases } = require("./utils/httpStatusCode");

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

// init routes
app.use("/", require("./routes"));

// handling error
app.use((req, res, next) => {
  const error = new Error(ReasonPhrases.NOT_FOUND);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
});

module.exports = app;
