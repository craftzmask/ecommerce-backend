"use strict";

const AccessService = require("../../services/access.service");
const { CREATED } = require("../../core/success.response");

class AccessController {
  static signUp = async (req, res) => {
    new CREATED({
      message: "Registered OK",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = AccessController;
