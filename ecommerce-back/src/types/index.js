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

const DISCOUNT_TYPE = {
  FIXED: "fixed",
  PERCENTAGE: "percentage",
};

const DISCOUNT_APPLIED_TO = {
  ALL: "all",
  SPECIFIC: "specific",
};

const CART_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  FAILED: "failed",
  PENDING: "pending",
};

const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELED: "canceled",
};

const NOTIFICATION_TYPE = {
  NEW_ORDER: "ORDER-001",
  DISCOUNT_ORDER: "ORDER-002",
  NEW_PROMO: "PROMO-001",
  ALL: "ALL",
  // we can add more here
};

module.exports = {
  HEADERS,
  PRODUCT_TYPE,
  SHOP_STATUS,
  SHOP_ROLE,
  DISCOUNT_TYPE,
  DISCOUNT_APPLIED_TO,
  CART_STATUS,
  ORDER_STATUS,
  NOTIFICATION_TYPE,
};
