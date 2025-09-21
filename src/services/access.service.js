"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const KeyTokenService = require("./keyToken.service");
const ShopService = require("./shop.service");
const ShopModel = require("../models/shop.model");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  READER: "READER",
  ADMIN: "ADMIN",
};

const handleRefreshToken = async (refreshToken) => {
  // Check if the refreshToken used being used again
  const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);

  // suspect someone accessed to this token illegally
  if (foundToken) {
    // Find out who is this
    const { userId } = JWT.verify(refreshToken, foundToken.privateKey);

    // Delete whole key in db
    await KeyTokenService.deleteKeyTokenByUserId(userId);
    throw new ForbiddenError("Something wrong happened! Please login again");
  }

  // Everything is ok, provides a new pair of tokens to user

  // Check if the refreshToken is valid
  const tokenHolder = await KeyTokenService.findByRefreshToken(refreshToken);
  if (!tokenHolder) throw new AuthFailureError("Shop is not registered 1");

  // Verify refresh token
  const { userId, email } = JWT.verify(refreshToken, tokenHolder.privateKey);

  // Make sure the email is valid and associate with the shop
  const foundShop = await ShopService.findByEmail({ email });
  if (!foundShop) throw new AuthFailureError("Shop is not registered 2");

  // Generate a new pair of tokens
  const tokens = await createTokenPair(
    { userId, email },
    tokenHolder.privateKey,
    tokenHolder.publicKey
  );

  await tokenHolder.updateOne({
    $set: {
      refreshToken: tokens.refreshToken, // update new refreshToken
    },
    $addToSet: {
      refreshTokensUsed: refreshToken, // add the used refreshToken to keep track
    },
  });

  return {
    user: { userId, email },
    tokens,
  };
};

// Update handleRefreshToken according to authenticationV2 middleware
const handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
  const { userId, email } = user;

  // suspect someone accessed to this token illegally
  if (keyStore.refreshTokensUsed.includes(refreshToken)) {
    // Delete whole key in db
    await KeyTokenService.deleteKeyTokenByUserId(userId);
    throw new ForbiddenError("Something wrong happened! Please login again");
  }

  // Check if the refreshToken is valid
  if (keyStore.refreshToken !== refreshToken) {
    throw new AuthFailureError("Shop is not registered 1");
  }

  // Make sure the email is valid and associate with the shop
  const foundShop = await ShopService.findByEmail({ email });
  if (!foundShop) {
    throw new AuthFailureError("Shop is not registered 2");
  }

  // Generate a new pair of tokens
  const tokens = await createTokenPair(
    { userId, email },
    keyStore.privateKey,
    keyStore.publicKey
  );

  await keyStore.updateOne({
    $set: {
      refreshToken: tokens.refreshToken, // update new refreshToken
    },
    $addToSet: {
      refreshTokensUsed: refreshToken, // add the used refreshToken to keep track
    },
  });

  return {
    user,
    tokens,
  };
};

const logout = async ({ keyStore }) => {
  return await KeyTokenService.removeKeyById(keyStore._id);
};

const login = async ({ email, password, refreshToken = null }) => {
  const foundShop = await ShopService.findByEmail({ email });
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

const signUp = async ({ name, email, password }) => {
  // check if email exist
  const holderShop = await ShopService.findByEmail({ email });
  if (holderShop) {
    throw new ConflictRequestError("Error: Shop email is already registered!");
  }

  // sign up shop
  const passwordHash = await bcrypt.hash(password, 10);
  const newShop = await ShopModel.create({
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

const AccessService = {
  logout,
  login,
  signUp,
  handleRefreshToken,
  handleRefreshTokenV2,
};

module.exports = AccessService;
