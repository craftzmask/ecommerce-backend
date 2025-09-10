"use strict";

const express = require("express");
const accessController = require("../../controllers/access/access.controller");
const router = express.Router();

const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("/shop/signup", asyncErrorHandler(accessController.signUp));
router.post("/shop/login", asyncErrorHandler(accessController.login));

// Authentication
router.use(authentication);

router.post("/shop/logout", asyncErrorHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncErrorHandler(accessController.handleRefreshToken)
);

module.exports = router;
