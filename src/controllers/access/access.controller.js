"use strict";

const AccessService = require("../../services/access.service");

class AccessController {
  static signUp = async (req, res) => {
    return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = AccessController;
