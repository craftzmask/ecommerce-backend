"use strict";

const keyTokenModel = require("../models/keyToken.model");

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
}

module.exports = KeyTokenService;
