"use strict";

const {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
} = require("../core/error.response");
const DiscountModel = require("../models/discount.model");
const DiscountRepo = require("../models/repositories/discount.repo");
const ProductRepo = require("../models/repositories/product.repo");

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
    throw new BadRequestError("Discount code is expired");
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new BadRequestError("Start date must be before end date");
  }

  const foundDiscount = await DiscountModel.findOne({ code, shopId }).lean();

  if (foundDiscount && foundDiscount.discount_isActive) {
    throw new ConflictRequestError("Discount code already exists");
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

const findAllProductsWithDiscountCode = async ({
  code,
  shopId,
  limit,
  page,
}) => {
  const foundDiscount = await DiscountModel.findOne({ code, shopId });
  if (!foundDiscount || !foundDiscount.isActive) {
    throw new NotFoundError("Discount does not exist");
  }

  if (foundDiscount.appliedTo === "all") {
    return ProductRepo.findAllProducts({
      filter: {
        product_shop: shopId,
        isPublished: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name"],
    });
  }

  if (foundDiscount.appliedTo === "specific") {
    return ProductRepo.findAllProducts({
      filter: {
        _id: { $in: foundDiscount.productIds },
        isPublished: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name"],
    });
  }

  return [];
};

const findAllDiscountCodesByShopId = async ({ limit, page, shopId }) => {
  return await DiscountRepo.findAllDiscountCodesUnSelect({
    limit: +limit,
    page: +page,
    model: DiscountModel,
    filter: { shopId, isActive: true },
    unSelect: ["__v", "shopId"],
  });
};

const DiscountService = {
  createDiscountCode,
  findAllProductsWithDiscountCode,
  findAllDiscountCodesByShopId,
};

module.exports = DiscountService;
