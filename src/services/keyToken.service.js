"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

const createKeyToken = async ({
  userId,
  privateKey,
  publicKey,
  refreshToken,
}) => {
  const filter = { user: userId };
  const update = {
    privateKey,
    publicKey,
    refreshToken,
    refreshTokensUsed: [],
  };
  const options = { upsert: true, new: true };

  const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

  return tokens ? tokens.publicKey : null;
};

const findByUserId = async (userId) => {
  return await keyTokenModel
    .findOne({ user: Types.ObjectId.createFromHexString(userId) })
    .lean();
};

const removeKeyById = async (id) => {
  return await keyTokenModel.deleteOne({
    _id: id,
  });
};

const KeyTokenService = { createKeyToken, findByUserId, removeKeyById };

module.exports = KeyTokenService;
