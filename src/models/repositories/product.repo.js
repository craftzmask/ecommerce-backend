const { ProductModel } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await ProductModel.findOne({
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
  const foundProduct = await ProductModel.findOne({
    product_shop: Types.ObjectId.createFromHexString(product_shop),
    _id: Types.ObjectId.createFromHexString(product_id),
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await ProductModel.find(
    { $text: { $search: regexSearch }, isPublished: true },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result;
};

const queryProducts = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const ProductRepo = {
  publishProductByShop,
  unPublishProductByShop,
  findAllDraftsForShop,
  findAllPublishForShop,
  searchProductsByUser,
};

module.exports = ProductRepo;
