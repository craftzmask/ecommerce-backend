"use strict";

const AccessService = require("../../services/access.service");
const { OK, CREATED } = require("../../core/success.response");

class AccessController {
  static logout = async (req, res) => {
    new OK({
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  static login = async (req, res) => {
    new OK({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  static signUp = async (req, res) => {
    new CREATED({
      message: "Registered OK",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = AccessController;
