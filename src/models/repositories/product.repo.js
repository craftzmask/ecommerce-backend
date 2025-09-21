const { productModel } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    product_shop: Types.ObjectId.createFromHexString(product_shop),
    _id: Types.ObjectId.createFromHexString(product_id),
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    product_shop: Types.ObjectId.createFromHexString(product_shop),
    _id: Types.ObjectId.createFromHexString(product_id),
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const queryProducts = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const productRepo = {
  publishProductByShop,
  unPublishProductByShop,
  findAllDraftsForShop,
  findAllPublishForShop,
};

module.exports = productRepo;
