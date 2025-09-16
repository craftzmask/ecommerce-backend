"use strict";

const JWT = require("jsonwebtoken");
const asyncErrorHandler = require("../helpers/asyncErrorHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refreshtoken-id",
};

const createTokenPair = (payload, privateKey, publicKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.error("error verify::", error);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

// Improve and fix error logic
const authentication = asyncErrorHandler(async (req, res, next) => {
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not Found keyStore");
  }

  const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid User Id");
      }

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request");
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid User Id");
    }

    req.keyStore = keyStore;
    req.user = decodeUser;

    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
