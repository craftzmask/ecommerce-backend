"use strict";

const CartService = require("../services/cart.service");
const { OK } = require("../core/success.response");

const addToCart = async (req, res) => {
  OK({
    message: "Add item to cart successfully",
    metadata: await CartService.addToUserCart(req.body),
  }).send(res);
};

const getAllItemsFromCart = async (req, res) => {
  OK({
    message: "Get all items from cart successfully",
    metadata: await CartService.getListItemsFromUserCart(req.body),
  }).send(res);
};

const deleteProductFromCart = async (req, res) => {
  OK({
    message: "Delete item successfully",
    metadata: await CartService.deleteProductFromUserCart(req.body),
  }).send(res);
};

const updateCart = async (req, res) => {
  OK({
    message: "Update cart successfully",
    metadata: await CartService.updateUserCart(req.body),
  }).send(res);
};

const CartController = {
  addToCart,
  getAllItemsFromCart,
  deleteProductFromCart,
  updateCart,
};

module.exports = CartController;
