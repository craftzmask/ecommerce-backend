"use strict";

const express = require("express");
const accessController = require("../../controllers/access/access.controller");
const router = express.Router();

const { asyncErrorHandler } = require("../../auth/checkAuth");

router.post("/shop/signup", asyncErrorHandler(accessController.signUp));
router.post("/shop/login", asyncErrorHandler(accessController.login));

module.exports = router;
