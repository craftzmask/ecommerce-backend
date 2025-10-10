"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const CartRepo = require("../models/repositories/cart.repo");
const ProductRepo = require("../models/repositories/product.repo");
const InventoryRepo = require("../models/repositories/inventory.repo");
const DiscountService = require("../services/discount.service");
const OrderModel = require("../models/order.model");

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
              shopId,
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
              shopId,
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

/**
  1. Reivew the cart
  2. get all products
  3. check inventory for each product
      if any product does not have enough stock in inventory => reject
      else update inventory
  4. everything go well -> process the order
  5. return order infomation
 */
const checkoutOrder = async ({
  userId,
  cartId,
  userPayment = {},
  userAddress = {},
  shopOrderItems,
}) => {
  const { newShopOrderItems, checkoutOrder } = await checkoutReview({
    userId,
    cartId,
    shopOrderItems,
  });

  if (newShopOrderItems.length === 0) {
    throw new BadRequestError("The list of items is empty");
  }

  const products = newShopOrderItems.flatMap((shop) => shop.items);

  // Check inventory for each product
  const productCheckPassed = [];
  for (const product of products) {
    const document = await InventoryRepo.updateProductInventory({
      productId: product.productId,
      shopId: product.shopId,
      quantity: product.quantity,
      cartId,
    });

    // Check if any product inventory failed
    productCheckPassed.push(document.modifiedCount ? true : false);
  }

  if (productCheckPassed.includes(false)) {
    throw new BadRequestError(
      "One or more products in your cart have been updated. Please check again!"
    );
  }

  return await OrderModel.create({
    userId,
    cartId,
    products,
    payment: userPayment,
    shipping: userAddress,
    checkoutOrderInfo: checkoutOrder,
  });
};

const CheckoutService = { checkoutReview, checkoutOrder };

module.exports = CheckoutService;
