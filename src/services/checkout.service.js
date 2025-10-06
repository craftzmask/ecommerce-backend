"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const CartRepo = require("../models/repositories/cart.repo");
const ProductRepo = require("../models/repositories/product.repo");
const DiscountService = require("../services/discount.service");

/**
  {
    userId
    cartId
    shopOrderItems: [
       {
          shopId,
          shopDiscounts = [],
          items: [
              productId,
              quantity,
              price
          ]
       },
      {
          shopId,
          shopDiscounts = [
            {
              shopId,
              discountId,
              code
            }
          ],
          items: [
              productId,
              quantity,
              price
          ]
      }
    ]
  }
*/
const checkoutReview = async ({ userId, cartId, shopOrderItems = [] }) => {
  const cart = await CartRepo.findById(cartId);
  if (!cart) {
    throw new NotFoundError("Cart does not exist");
  }

  const checkoutOrder = {
    totalPrice: 0,
    feeShip: 0,
    discountAmount: 0,
    totalCheckout: 0,
  };

  const newShopOrderItems = [];

  for (const shop of shopOrderItems) {
    const { shopId, shopDiscounts = [], items = [] } = shop;

    // Ensure item price by checking from server
    const products = await ProductRepo.checkPriceFromServer(items);
    if (!products[0]) {
      throw new BadRequestError("Order Wrong!");
    }

    // Calculate total price before discount
    const totalPrice = products.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);
    checkoutOrder.totalPrice += totalPrice;

    // Calculate discount amount
    let totalDiscountAmount = 0;
    for (const discount of shopDiscounts) {
      const { discountAmount } = await DiscountService.getDiscountAmount({
        code: discount.code,
        shopId: discount.shopId,
        userId,
        products,
      });

      checkoutOrder.discountAmount += discountAmount;
      totalDiscountAmount += discountAmount;
    }

    // Calculate total check out each shop with its items
    const totalCheckout = totalPrice - totalDiscountAmount;

    // Add new checked out item
    newShopOrderItems.push({
      shopId,
      shopDiscounts,
      totalPrice,
      totalCheckout,
      items: products,
    });

    checkoutOrder.totalCheckout += totalCheckout;
  }

  return {
    shopOrderItems,
    newShopOrderItems,
    checkoutOrder,
  };
};

const CheckoutService = { checkoutReview };

module.exports = CheckoutService;
