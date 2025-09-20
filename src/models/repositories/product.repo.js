const { productModel } = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const productRepo = { findAllDraftsForShop };

module.exports = productRepo;
