"use strict";

const ApikeyModel = require("../models/apikey.model");

const findByKey = async (key) => {
  return await ApikeyModel.findOne({ key, isActive: true });
};

const ApiKeyService = { findByKey };

module.exports = ApiKeyService;
