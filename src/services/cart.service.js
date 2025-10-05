/**
 * 1. Add product to cart (done)
 * 2. Reduce product quantity
 * 3. Increase product quantity
 * 4. Get list to cart
 * 5. Delete cart
 * 6. Delete cart item
 */

const CartModel = require("../models/cart.model");
const { ProductModel } = require("../models/product.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { CART_STATUS } = require("../types");
const { isEmptyObject } = require("../utils");

/**
 * product = {
 *    productId,
 *    userId,
 *    shopId,
 *    quantity
 * }
 */

// REPO
const createNewUserCart = async ({ userId, product = {} }) => {
  const filter = { userId, status: CART_STATUS.ACTIVE };
  const update = {
    $addToSet: { products: product },
    $inc: { productCount: product.quantity },
  };
  const options = { upsert: true, new: true };

  return await CartModel.findOneAndUpdate(filter, update, options);
};

const updateProductQuantityInUserCart = async ({ userId, product }) => {
  const filter = {
    userId,
    "products.productId": product.productId,
    status: CART_STATUS.ACTIVE,
  };
  const update = {
    $inc: {
      "products.$.quantity": product.quantity,
      productCount: product.quantity,
    },
  };
  const options = { upsert: true, new: true };

  return await CartModel.findOneAndUpdate(filter, update, options);
};
// END REPO

const addToUserCart = async ({ userId, product = {} }) => {
  if (isEmptyObject(product)) {
    throw new BadRequestError("Cannot add an empty product");
  }

  const { productId, quantity } = product;

  const foundProduct = await ProductModel.findById(product.productId);
  if (!foundProduct) {
    throw new NotFoundError("Product does not exist");
  }

  product.name = foundProduct.name;
  product.price = foundProduct.price;

  // If cart does not exist, then create one
  const cart = await CartModel.findOne({ userId, status: CART_STATUS.ACTIVE });
  if (!cart) {
    return await createNewUserCart({ userId, product });
  }
  // if cart exists and already has that product, then update quantity
  if (cart.products.find((p) => p.productId === productId)) {
    return await updateProductQuantityInUserCart({ userId, product });
  }

  // If cart exists, but does not have product, add it
  cart.products.push(product);
  cart.productCount += quantity;
  return await cart.save();
};

/**
 * Request incoming
 *
 *  shopOrderItems: [
 *    {
 *       shopId,
 *       items: [
 *           {
 *               productId
 *               shopId
 *               quantity
 *               price
 *               oldQuantity
 *           }
 *       ],
 *       version
 *    }
 * ]
 */

const updateUserCart = async ({ userId, shopOrderItems }) => {
  const { productId, quantity, oldQuantity } = shopOrderItems[0]?.items[0]; // Example, only works for the first shop

  const foundProduct = await ProductModel.findById(productId);
  if (!foundProduct) {
    throw new NotFoundError("Product does not exist");
  }

  if (foundProduct.shopId.toString() !== shopOrderItems[0]?.shopId.toString()) {
    throw new BadRequestError("Product does not belong to shop");
  }

  if (quantity === 0) {
    await deleteProductFromUserCart({ userId, productId });
  }

  return await updateProductQuantityInUserCart({
    userId,
    product: {
      productId,
      quantity: quantity - oldQuantity,
    },
  });
};

const deleteProductFromUserCart = async ({ userId, productId }) => {
  const cart = await CartModel.findOne({ userId });
  const foundProduct = cart.products.find((p) => p.productId === productId);
  if (!foundProduct) {
    throw new NotFoundError("Product does not exist in cart");
  }

  const filter = {
    userId,
    "products.productId": productId,
    status: CART_STATUS.ACTIVE,
  };

  const update = {
    $pull: {
      products: { productId },
    },
    $inc: {
      productCount: -foundProduct.quantity,
    },
  };

  return await CartModel.updateOne(filter, update).lean();
};

const getListItemsFromUserCart = async ({ userId }) => {
  return await CartModel.find({ userId }).lean();
};

const CartService = {
  addToUserCart,
  updateUserCart,
  deleteProductFromUserCart,
  getListItemsFromUserCart,
};

module.exports = CartService;
