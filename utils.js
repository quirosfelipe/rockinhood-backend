//REQUIRED PACKAGES
const { validationResult } = require("express-validator");


const asyncHandler = (handler) => (req, res, next) => 
    handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map(error => error.msg);
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
};

const stockNotFoundError = (stockSymbol) => {
    const err = Error("Stock not found");
    err.errors = [`Stock with symbol of ${stockSymbol} could not be found.`];
    err.title = "Stock not found.";
    err.status = 404;
    return err;
};


module.exports = { asyncHandler, handleValidationErrors, stockNotFoundError };