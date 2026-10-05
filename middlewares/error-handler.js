const { INTERNAL_SERVER_ERROR_CODE } = require("../utils/errors");

module.exports = (err, req, res, _next) => {
  console.error(err);

  const { statusCode = INTERNAL_SERVER_ERROR_CODE, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR_CODE
        ? "An error has occurred on the server"
        : message,
  });
};
