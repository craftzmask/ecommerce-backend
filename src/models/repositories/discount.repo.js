"use strict";

const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
  limit,
  sort,
  page,
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortedBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await model
    .find(filter)
    .sort(sortedBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();
};

const findAllDiscountCodesSelect = async ({
  limit,
  sort,
  page,
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortedBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await model
    .find(filter)
    .sort(sortedBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

const DiscountRepo = {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
};

module.exports = DiscountRepo;
