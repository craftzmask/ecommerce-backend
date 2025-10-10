const InventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "Unknown",
}) => {
  return await InventoryModel.create({
    productId,
    shopId,
    stock,
    location,
  });
};

const reserveInventory = async ({ productId, shopId, quantity, cartId }) => {
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
        cartId,
        quantity,
        createdOn: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };

  return await InventoryModel.updateOne(filter, update, options);
};

const InventoryRepo = { insertInventory, reserveInventory };

module.exports = InventoryRepo;
