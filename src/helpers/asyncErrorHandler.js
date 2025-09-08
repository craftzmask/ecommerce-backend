const asyncErrorHandler = (fn) => {
  console.log("went through asyncErrorHandler");
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

module.exports = asyncErrorHandler;
