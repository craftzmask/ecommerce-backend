"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  READER: "READER",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop is not found");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error");

    const { tokens } = await provisionAuthSession({
      userId: foundShop._id,
      email,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check if email exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new ConflictRequestError(
        "Error: Shop email is already registered!"
      );
    }

    // sign up shop
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    // create token after new shop is signed up successfully
    if (newShop) {
      const { tokens, keyStore } = await provisionAuthSession({
        userId: newShop._id,
        email,
      });

      if (!keyStore) {
        throw new ConflictRequestError("Error: keyStore error!");
      }

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }

    // if shop was not created successfully
    throw new BadRequestError("Created Shop Failed");
  };
}

async function provisionAuthSession(payload) {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");

  const tokens = createTokenPair(payload, privateKey, publicKey);

  const keyStore = await KeyTokenService.createKeyToken({
    userId: payload.userId,
    privateKey,
    publicKey,
    refreshToken: tokens.refreshToken,
  });

  return { tokens, keyStore };
}

module.exports = AccessService;
