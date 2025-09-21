"use strict";

const pick = require("lodash/pick");

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

module.exports = {
  getInfoData,
  getSelectData,
};
