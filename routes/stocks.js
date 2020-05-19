//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler } = require("../utils");
const router = express.Router();
const { Company } = require("../db/models");

const stockNotFoundError = (stockSymbol) => {
    const err = Error("Scock not found");
    err.errors = [`Stock with symbol of ${stockSymbol} could not be found.`];
    err.title = "Stock not found.";
    err.status = 404;
    return err;
};

router.get(
    "/:id",
    asyncHandler(async(req, res, next) => {
        console.log(req.params.id)
        const stock = await Company.findOne({
            where: {
                symbol: req.params.id,
            },
        });
        if (stock) {
            res.json({ stock });    
        } else {
            next(stockNotFoundError(req.params.id)); //need to write error handler
        }    
}));

module.exports = router;