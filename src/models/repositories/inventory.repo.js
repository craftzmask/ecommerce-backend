const InventoryModel = require("../inventory.model");

const updateProductInventory = async ({
  productId,
  shopId,
  quantity,
  cartId,
}) => {
  const filter = {
    productId,
    shopId,
    stock: {
      $gte: quantity,
    },
  };
  const update = {
    $inc: {
      stock: -quantity,
    },
    $push: {
      reservations: {
        productId,
        shopId,
        cartId,
        quantity,
      },
    },
  };
  const options = { upsert: true, new: true };

  return await InventoryModel.updateOne(filter, update, options);
};

const InventoryRepo = { updateProductInventory };

module.exports = InventoryRepo;
