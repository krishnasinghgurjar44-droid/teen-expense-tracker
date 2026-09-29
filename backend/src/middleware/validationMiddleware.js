const apiResponse = require('../utils/apiResponse');

/**
 * Higher-order middleware function to execute a validator against req
 * @param {Function} validatorFn - Function receiving req that returns an array of error messages or empty array
 */
function validate(validatorFn) {
  return (req, res, next) => {
    try {
      const errors = validatorFn(req);
      if (errors && errors.length > 0) {
        return apiResponse.error(
          res,
          'Validation failed. Please correct the highlighted errors.',
          errors,
          422
        );
      }
      next();
    } catch (err) {
      console.error('Validation middleware error:', err);
      return apiResponse.error(res, 'Internal validation error', err.message, 500);
    }
  };
}

module.exports = validate;
