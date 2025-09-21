"use strict";

const {
  productModel,
  electronicModel,
  clothingModel,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const productRepo = require("../models/repositories/product.repo");

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

  static async publishProductByShop({ product_shop, product_id }) {
    return await productRepo.publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await productRepo.unPublishProductByShop({
      product_shop,
      product_id,
    });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await productRepo.findAllDraftsForShop({
      query,
      limit,
      skip,
    });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await productRepo.findAllPublishForShop({
      query,
      limit,
      skip,
    });
  }

  static async searchProductsByUser({ keySearch }) {
    return await productRepo.searchProductsByUser({ keySearch });
  }
}

/*
  Product base class
*/
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
    return await productModel.create({ ...this, _id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
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
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
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
}

// Register product types
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
