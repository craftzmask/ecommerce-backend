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
  return await keyTokenModel.findOne({
    user: Types.ObjectId.createFromHexString(userId),
  });
};

const removeKeyById = async (id) => {
  return await keyTokenModel.deleteOne({
    _id: id,
  });
};

const findByRefreshToken = async (refreshToken) => {
  return await keyTokenModel.findOne({ refreshToken });
};

const findByRefreshTokenUsed = async (refreshToken) => {
  return await keyTokenModel
    .findOne({ refreshTokensUsed: refreshToken })
    .lean();
};

const deleteKeyTokenByUserId = async (userId) => {
  return await keyTokenModel.deleteOne({ user: userId });
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
