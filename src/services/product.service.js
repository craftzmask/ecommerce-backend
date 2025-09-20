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

  static async createProduct(payload) {
    const productClass = ProductFactory.productRegistry[payload.type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    }

    return new productClass(payload).createProduct();
  }

  // ACTIONS - Shop
  static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { shopId, isDraft: true };
    return await productRepo.findAllDraftsForShop({
      query,
      limit,
      skip,
    });
  }
}

/*
  Product base class
*/
class Product {
  constructor({
    name,
    thumb,
    description,
    quantity,
    price,
    type,
    shopId,
    attributes,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
    this.type = type;
    this.shopId = shopId;
    this.attributes = attributes;
  }

  async createProduct(_id) {
    return await productModel.create({ ...this, _id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.attributes,
      shopId: this.shopId,
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
      ...this.attributes,
      shopId: this.shopId,
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
const productType = {
  ELECTRONIC: "Electronic",
  CLOTHING: "Clothing",
};

ProductFactory.registerProductType(productType.CLOTHING, Clothing);
ProductFactory.registerProductType(productType.ELECTRONIC, Electronic);

module.exports = ProductFactory;
