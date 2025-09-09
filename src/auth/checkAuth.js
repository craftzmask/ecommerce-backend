"use strict";

const { findById } = require("../services/apikey.service");
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

const HEADERS = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADERS.API_KEY]?.toString();
    if (!key) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: ReasonPhrases.FORBIDDEN,
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: ReasonPhrases.FORBIDDEN,
      });
    }

    req.objKey = objKey;

    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    const permissions = req.objKey.permissions;
    if (!permissions) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Permission denied",
      });
    }

    console.log("permissions::", permissions);
    const validPermission = permissions.includes(permission);
    if (!validPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Permission denied",
      });
    }

    next();
  };
};

module.exports = {
  apiKey,
  permission,
};
