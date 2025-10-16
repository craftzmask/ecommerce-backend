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

class OkResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonPhrase = ReasonPhrases.CREATED,
    metadata = {},
  }) {
    super({ message, statusCode, reasonPhrase, metadata });
  }
}

const OK = ({ message, metadata }) => {
  return new OkResponse({ message, metadata });
};

const CREATED = ({ message, metadata }) => {
  return new CreatedResponse({ message, metadata });
};

module.exports = {
  OK,
  CREATED,
};
