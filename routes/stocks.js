//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler } = require("../utils");
const router = express.Router();
const { Company } = require("../db/models");
const { stockHistoricalPrices } = require("./yahoo-api")

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
        //console.log(req.params.id)
        const stock = await Company.findOne({
            where: {
                symbol: req.params.id,
            },
        });
        if (stock) {
            res.json({ stock });    
        } else {
            next(stockNotFoundError(req.params.id));
        }    
}));

// ROUTE RETURNS HISTORICAL STOCK PRICES
router.get(
    "/chartinfo/:id",
    asyncHandler(async(req, res, next) => {
        const ticker = req.params.id;
        await stockHistoricalPrices(ticker, 30, async(data) => {
            if (data) {
                await res.json({ data });
            } else {
                next(stockNotFoundError(req.params.id));
            }    
        });    
}));




module.exports = router;