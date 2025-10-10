const CartModel = require("../cart.model");
const { CART_STATUS } = require("../../types");
const { NotFoundError } = require("../../core/error.response");

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

const findById = async (id) => {
  return CartModel.findOne({ _id: id, status: CART_STATUS.ACTIVE }).lean();
};

const clearProducts = async ({ userId, products }) => {
  const cart = await CartModel.findOne({ userId, status: CART_STATUS.ACTIVE });
  if (!cart) {
    throw new NotFoundError("Cart does not exist");
  }

  const idSet = new Set(products.map((p) => p.productId.toString()));
  cart.products = cart.products.filter(
    (p) => !idSet.has(p.productId.toString())
  );

  cart.productCount = cart.products.reduce((totalQuantity, product) => {
    return totalQuantity + product.quantity;
  }, 0);

  return await cart.save();
};

const CartRepo = {
  createNewUserCart,
  updateProductQuantityInUserCart,
  findById,
  clearProducts,
};

module.exports = CartRepo;
