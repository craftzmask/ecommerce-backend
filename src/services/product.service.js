"use strict";

const {
  ProductModel,
  ElectronicModel,
  ClothingModel,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const ProductRepo = require("../models/repositories/product.repo");
const { updateNestedObject, removeNullObject } = require("../utils");
const InventoryModel = require("../models/inventory.model");
const { PRODUCT_TYPE } = require("../types");

class ProductFactory {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static async createProduct({ type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    }

    return new productClass(payload).createProduct();
  }

  static async publishProductByShop({ productId, shopId }) {
    return await ProductRepo.publishProductByShop({ productId, shopId });
  }

  static async unPublishProductByShop({ productId, shopId }) {
    return await ProductRepo.unPublishProductByShop({ productId, shopId });
  }

  static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { shopId, isDraft: true };
    return await ProductRepo.findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { shopId, isPublished: true };
    return await ProductRepo.findAllPublishForShop({ query, limit, skip });
  }

  static async searchProductsByUser({ keySearch }) {
    return await ProductRepo.searchProductsByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return ProductRepo.findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["_id", "description", "thumb"],
    });
  }

  static async findProduct({ productId }) {
    return ProductRepo.findProduct({ productId, unSelect: ["__v"] });
  }

  static async updateProduct({ productId, shopId, type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    }

    return new productClass(payload).updateProduct({ productId, shopId });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_price,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(_id) {
    const newProduct = await ProductModel.create({ ...this, _id });
    if (newProduct) {
      await InventoryModel.create({
        inven_productId: newProduct._id,
        inven_shopId: newProduct.product_shop,
        inven_stock: newProduct.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct({ productId, shopId, productObject }) {
    return await ProductRepo.updateProduct({
      productId,
      shopId,
      productObject,
      model: ProductModel,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) {
      throw new BadRequestError("Create Clothing Error");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create New Product Error");
    }

    return newProduct;
  }

  async updateProduct({ productId, shopId }) {
    const productObject = removeNullObject(this);

    if (productObject.product_attributes) {
      await ProductRepo.updateProduct({
        productId,
        shopId,
        productObject: updateNestedObject(
          removeNullObject(productObject.product_attributes)
        ),
        model: ClothingModel,
      });
    }

    return await super.updateProduct({
      productId,
      shopId,
      productObject: updateNestedObject(productObject),
    });
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError("Create Clothing Error");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create New Product Error");
    }

    return newProduct;
  }

  async updateProduct({ productId, shopId }) {
    const productObject = removeNullObject(this);

    if (productObject.product_attributes) {
      await ProductRepo.updateProduct({
        productId,
        shopId,
        productObject: updateNestedObject(
          removeNullObject(productObject.product_attributes)
        ),
        model: ElectronicModel,
      });
    }

    return await super.updateProduct({
      productId,
      shopId,
      productObject: updateNestedObject(productObject),
    });
  }
}

ProductFactory.registerProductType(PRODUCT_TYPE.ELECTRONIC, Electronic);
ProductFactory.registerProductType(PRODUCT_TYPE.CLOTHING, Clothing);

module.exports = ProductFactory;
