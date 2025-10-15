"use strict";

const pick = require("lodash/pick");

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeNullObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};

const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObject(obj[key]);
      Object.keys(response).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

const isEmptyObject = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return false;
  }

  return Object.keys(obj).length === 0;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeNullObject,
  updateNestedObject,
  isEmptyObject,
};
