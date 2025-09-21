"use strict";

const KeyTokenModel = require("../models/keyToken.model");
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

  const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options);

  return tokens ? tokens.publicKey : null;
};

const findByUserId = async (userId) => {
  return await KeyTokenModel.findOne({
    user: Types.ObjectId.createFromHexString(userId),
  });
};

const removeKeyById = async (id) => {
  return await KeyTokenModel.deleteOne({
    _id: id,
  });
};

const findByRefreshToken = async (refreshToken) => {
  return await KeyTokenModel.findOne({ refreshToken });
};

const findByRefreshTokenUsed = async (refreshToken) => {
  return await KeyTokenModel.findOne({
    refreshTokensUsed: refreshToken,
  }).lean();
};

const deleteKeyTokenByUserId = async (userId) => {
  return await KeyTokenModel.deleteOne({ user: userId });
};

const KeyTokenService = {
  createKeyToken,
  findByUserId,
  removeKeyById,
  findByRefreshTokenUsed,
  deleteKeyTokenByUserId,
  findByRefreshToken,
};

module.exports = KeyTokenService;
