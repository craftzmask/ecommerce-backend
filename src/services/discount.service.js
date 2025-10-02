"use strict";

const {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
} = require("../core/error.response");
const DiscountModel = require("../models/discount.model");
const DiscountRepo = require("../models/repositories/discount.repo");
const ProductRepo = require("../models/repositories/product.repo");
const { DISCOUNT_APPLIED_TO, DISCOUNT_TYPE } = require("../types");

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
  userUsedIds,
  maxUsesPerUser,
  minOrderValue,
  shopId,
  isActive,
  appliedTo,
  productIds,
}) => {
  const now = new Date();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new BadRequestError("Invalid start/end date");
  }

  if (start <= now) {
    throw new BadRequestError("Discount code start date must be in futture");
  }

  if (end <= start) {
    throw new BadRequestError(
      "Discount code end date must be after start date"
    );
  }

  if (type === DISCOUNT_TYPE.PERCENTAGE) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new BadRequestError("Discount percentage must be a number");
    }

    if (!(value > 0 && value <= 100)) {
      throw new BadRequestError("Discount percentage must be > 0 and <= 100");
    }

    if (!Number.isInteger(value)) {
      throw new BadRequestError("Discount percentage must be a whole interger");
    }
  }

  if (minOrderValue <= 0) {
    throw new BadRequestError(
      "The minimum order value must be greater than $0"
    );
  }

  const foundDiscount = await DiscountRepo.findDiscountCode({
    filter: { code, shopId },
    model: DiscountModel,
  });
  if (foundDiscount) {
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
    userUsedIds,
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
  const foundDiscount = await DiscountRepo.findDiscountCode({
    filter: { code, shopId },
    model: DiscountModel,
  });
  if (!foundDiscount || !foundDiscount.isActive) {
    throw new NotFoundError("Discount does not exist");
  }

  if (foundDiscount.appliedTo === DISCOUNT_APPLIED_TO.ALL) {
    return ProductRepo.findAllProducts({
      filter: {
        shopId,
        isPublished: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["name"],
    });
  }

  if (foundDiscount.appliedTo === DISCOUNT_APPLIED_TO.SPECIFIC) {
    return ProductRepo.findAllProducts({
      filter: {
        _id: { $in: foundDiscount.productIds },
        shopId,
        isPublished: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["name"],
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

const updateDiscountCode = async ({ code, shopId, payload }) => {
  const updateDiscountCode = await DiscountModel.findOneAndUpdate(
    { code, shopId },
    { $set: payload },
    { new: true }
  );

  if (!updateDiscountCode) {
    throw new NotFoundError("Discount code does not exist");
  }

  return updateDiscountCode;
};

/**
 * 1. Check if discount code exists
 * 2. Check if discount code is still active
 * 3. Check if discount code dates valid
 * 4. Check if discount max uses still available
 * 5. Check how many times current user uses this discount
 * 6. Checkt total order must be at least equal to the min value order to apply discount code
 * 7. Check discount type
 * 8. Check discount code apply to what products
 *.   8a. if apply to all:
          get total order and apply discount
      8b. if apply to specific:
          get all specific products and apply discount on those only
   9. Check if total order is at least min value order to apply discount
   10. return the discount amount along with total order and total checkout
 */

const getDiscountAmount = async ({ code, shopId, userId, products }) => {
  const foundDiscount = await DiscountRepo.findDiscountCode({
    filter: { code, shopId },
    model: DiscountModel,
  });

  if (!foundDiscount) {
    throw new NotFoundError("Discount code does not exist");
  }

  if (!foundDiscount.isActive) {
    throw new BadRequestError("Discount code is expired");
  }

  const now = new Date();
  const start = new Date(foundDiscount.startDate).getTime();
  const end = new Date(foundDiscount.endDate).getTime();

  if (now < start) {
    throw new BadRequestError("Discount code has not been active yet");
  }

  if (now > end) {
    throw new BadRequestError("Discount code is expired");
  }

  const numberUsesByUser = foundDiscount.userUsedIds.filter(
    (id) => id.toString() === userId
  );
  if (
    foundDiscount.maxUsesPerUser &&
    numberUsesByUser >= foundDiscount.maxUsesPerUser
  ) {
    throw new BadRequestError(
      `User has reached the maximum usage limit of ${foundDiscount.maxUsesPerUser} for this discount`
    );
  }

  let totalOrder = 0;
  if (foundDiscount.minOrderValue > 0) {
    if (foundDiscount.appliedTo === DISCOUNT_APPLIED_TO.ALL) {
      totalOrder = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    } else {
      const productIdSet = new Set(foundDiscount.productIds.map(String));
      const appliedProducts = products.filter((product) =>
        productIdSet.has(product._id.toString())
      );

      totalOrder = appliedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    }

    if (totalOrder < foundDiscount.minOrderValue) {
      throw new BadRequestError(
        `Discount requires a minimum order value of ${foundDiscount.minOrderValue}`
      );
    }
  }

  const amountDiscounted =
    foundDiscount.type === DISCOUNT_TYPE.FIXED
      ? foundDiscount.value
      : totalOrder * (foundDiscount.value / 100);

  return {
    totalOrder,
    amountDiscounted,
    totalCheckout: totalOrder - amountDiscounted,
  };
};

/**
 * It is better to check other factors before delete the discount code
 * For example, what if users applied valid discount code to their order
 * but have not purchased yet.
 */
const deleteDiscountCode = async ({ code, shopId }) => {
  return await DiscountModel.findOneAndDelete({
    code,
    shopId,
  });
};

const cancelDiscountCode = async ({ code, shopId, userId }) => {
  const foundDiscount = await DiscountRepo.findAllDiscountCodesSelect({
    code,
    shopId,
  });

  if (!foundDiscount) {
    throw new NotFoundError("Discount code does not exist");
  }

  return await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
    $pull: {
      userUsedIds: userId,
    },
    $inc: {
      quantity: 1,
      usesCount: -1,
    },
  });
};

const DiscountService = {
  createDiscountCode,
  updateDiscountCode,
  findAllProductsWithDiscountCode,
  findAllDiscountCodesByShopId,
  getDiscountAmount,
  deleteDiscountCode,
  cancelDiscountCode,
};

module.exports = DiscountService;
