"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");
const { pushToLogDiscord } = require("../middlewares");

router.use(pushToLogDiscord);

// check apikey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/discounts", require("./discount"));
router.use("/v1/api/carts", require("./cart"));
router.use("/v1/api/products", require("./product"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/shops", require("./access"));

module.exports = router;
