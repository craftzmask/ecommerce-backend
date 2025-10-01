const { ProductModel } = require("../product.model");
const { Types } = require("mongoose");
const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const publishProductByShop = async ({ productId, shopId }) => {
  const foundProduct = await ProductModel.findOne({
    shopId: Types.ObjectId.createFromHexString(shopId),
    _id: Types.ObjectId.createFromHexString(productId),
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const unPublishProductByShop = async ({ productId, shopId }) => {
  const foundProduct = await ProductModel.findOne({
    shopId: Types.ObjectId.createFromHexString(shopId),
    _id: Types.ObjectId.createFromHexString(productId),
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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortedBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await ProductModel.find(filter)
    .sort(sortedBy)
    .skip(skip)
    .limit(50)
    .select(getSelectData(select))
    .lean();
};

const findProduct = async ({ productId, unSelect }) => {
  return await ProductModel.findById(productId).select(
    getUnSelectData(unSelect)
  );
};

const updateProduct = async ({
  productId,
  shopId,
  productObject,
  model,
  isNew = true,
}) => {
  return await model.findOneAndUpdate(
    { _id: productId, shopId },
    productObject,
    { new: isNew }
  );
};

const queryProducts = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate("shopId", "name email -_id")
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
  findAllProducts,
  findProduct,
  updateProduct,
};

module.exports = ProductRepo;
