"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonPhrase = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message || reasonPhrase;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonPhrase = ReasonPhrases.OK,
    metadata = {},
  }) {
    super({ message, statusCode, reasonPhrase, metadata });
  }
}

module.exports = {
  OK,
  CREATED,
};
