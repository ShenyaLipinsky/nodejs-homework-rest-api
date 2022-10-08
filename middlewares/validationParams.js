const { RequestError } = require("../helpers");

const validationParams = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      next(RequestError((error.status = 400), error.message));
    }
    next();
  };

  return func;
};

module.exports = validationParams;
