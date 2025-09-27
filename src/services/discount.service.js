"use strict";

const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
const DiscountModel = require("../models/discount.model");

const createDiscountCode = async ({
  name,
  description,
  type,
  value,
  code,
  startDate,
  endDate,
  quantity,
  usesCount,
  usersUsed,
  maxUsesPerUser,
  minOrderValue,
  shopId,
  isActive,
  appliedTo,
  productIds,
}) => {
  const now = new Date();
  if (now < new Date(startDate) || now > new Date(endDate)) {
    throw new BadRequestError("Error: Discount code is expired");
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new BadRequestError("Error: Start date must be before end date");
  }

  const foundDiscount = await DiscountModel.findOne({ code, shopId }).lean();

  if (foundDiscount && foundDiscount.discount_isActive) {
    throw new ConflictRequestError("Error: Discount code already exists");
  }

  const newDiscountCode = await DiscountModel.create({
    name,
    description,
    type,
    value,
    code,
    shopId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    quantity,
    usesCount,
    usersUsed,
    maxUsesPerUser,
    minOrderValue,
    isActive,
    appliedTo,
    productIds,
  });

  return newDiscountCode;
};

module.exports = { createDiscountCode };
