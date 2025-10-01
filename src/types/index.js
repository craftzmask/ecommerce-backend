"use strict";

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refreshtoken-id",
};

const PRODUCT_TYPE = {
  ELECTRONIC: "electronic",
  CLOTHING: "clothing",
};

const SHOP_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const SHOP_ROLE = {
  SHOP: "shop",
  WRITER: "writer",
  READER: "reader",
  ADMIN: "admin",
};

module.exports = {
  HEADERS,
  PRODUCT_TYPE,
  SHOP_STATUS,
  SHOP_ROLE,
};
