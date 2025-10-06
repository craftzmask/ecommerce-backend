const CartModel = require("../cart.model");
const { CART_STATUS } = require("../../types");

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

const CartRepo = {
  createNewUserCart,
  updateProductQuantityInUserCart,
  findById,
};

module.exports = CartRepo;
