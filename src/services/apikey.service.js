"use strict";

const apikeyModel = require("../models/apikey.model");

const findById = async (key) => {
  const objKey = await apikeyModel.findOne({ key, status: true });
  return objKey;
};

const ApiKeyService = { findById };

module.exports = ApiKeyService;
