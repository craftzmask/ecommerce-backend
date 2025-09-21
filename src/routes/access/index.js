"use strict";

const express = require("express");
const router = express.Router();
const AccessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("/shop/signup", asyncErrorHandler(AccessController.signUp));
router.post("/shop/login", asyncErrorHandler(AccessController.login));

// Authentication
router.use(authentication);

router.post("/shop/logout", asyncErrorHandler(AccessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncErrorHandler(AccessController.handleRefreshToken)
);

module.exports = router;
