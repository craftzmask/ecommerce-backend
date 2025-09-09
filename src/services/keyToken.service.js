"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
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

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    console.log(userId);
    return await keyTokenModel
      .findOne({ user: Types.ObjectId.createFromHexString(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({
      _id: id,
    });
  };
}

module.exports = KeyTokenService;
