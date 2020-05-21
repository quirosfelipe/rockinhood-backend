//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { Company } = require("../db/models");
const { stockHistoricalPrices } = require("./yahoo-api")

const router = express.Router();



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

// ROUTE RETURNS "RECENT" STOCK PRICE (1b DAY OLD)
router.get(
    "/stockinfo/:id",
    asyncHandler(async (req, res, next) => {
        const ticker = req.params.id;
        const company = await Company.findOne({ where: { symbol: ticker }});

        if(!company){
            next(stockNotFoundError(req.params.id));
        } else {
            await stockHistoricalPrices(ticker, 0, async (data) => {
                if (data) {
                    await res.json({ data });
                } else {
                    next(stockNotFoundError(req.params.id));
                };
            })
        }     
}));        
    


module.exports = router;