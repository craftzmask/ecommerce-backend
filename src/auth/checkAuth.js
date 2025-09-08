"use strict";

const { findById } = require("../services/apikey.service");

const HEADERS = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADERS.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
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
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    console.log("permissions::", permissions);
    const validPermission = permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    next();
  };
};

const asyncErrorHandler = (fn) => {
  console.log("went through asyncErrorHandler");
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncErrorHandler,
};
