"use strict";

const express = require("express");
const router = express.Router();
const AccessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("/signup", asyncErrorHandler(AccessController.signUp));
router.post("/login", asyncErrorHandler(AccessController.login));

// Authentication
router.use(authentication);

router.post("/logout", asyncErrorHandler(AccessController.logout));
router.post(
  "/handleRefreshToken",
  asyncErrorHandler(AccessController.handleRefreshToken)
);

module.exports = router;
