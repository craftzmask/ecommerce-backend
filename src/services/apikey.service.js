"use strict";

const ApikeyModel = require("../models/apikey.model");

const findById = async (key) => {
  const objKey = await ApikeyModel.findOne({ key, status: true });
  return objKey;
};

const ApiKeyService = { findById };

module.exports = ApiKeyService;
