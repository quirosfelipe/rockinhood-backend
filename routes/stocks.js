//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { Company } = require("../db/models");
const { stockHistoricalPrices, getNews, getNewsList } = require("./yahoo-api")

const router = express.Router();


// ROUTE RETURN COMPANY INFO
router.get(
    "/:stockSymbol",
    asyncHandler(async(req, res, next) => {
        const stock = await Company.findOne({
            where: {
                symbol: req.params.stockSymbol,
            },
        });
        if (stock) {
            res.json({ stock });    
        } else {
            next(stockNotFoundError(req.params.stockSymbol));
        }    
}));

// ROUTE RETURNS HISTORICAL STOCK PRICES
router.get(
    "/chartinfo/:stockSymbol",
    asyncHandler(async(req, res, next) => {
        const ticker = req.params.stockSymbol;
        await stockHistoricalPrices(ticker, 30, async(data) => {
            if (data) {
                await res.json({ data });
            } else {
                next(stockNotFoundError(req.params.stockSymbol));
            }    
        });    
}));

// ROUTE RETURNS "RECENT" STOCK PRICE (1b DAY OLD)
router.get(
    "/stockinfo/:stockSymbol",
    asyncHandler(async (req, res, next) => {
        const ticker = req.params.stockSymbol;
        const company = await Company.findOne({ where: { symbol: ticker }});

        if(!company){
            next(stockNotFoundError(req.params.stockSymbol));
        } else {
            await stockHistoricalPrices(ticker, 0, async (data) => {
                if (data) {
                    await res.json({ data });
                } else {
                    next(stockNotFoundError(req.params.stockSymbol));
                };
            })
        }     
}));        
    
// ROUTE RETURNS FINANCIAL NEWS
router.get(
    "/news",
    asyncHandler(async (req, res, next) => {
       await getNews(async (data) => {
            if (data) {
                await res.json({ data });
            } else {
                next();
            }
        });
}));

// ROUTE RETURNS FINANCIAL NEWS LIST
router.get(
    "/newslist",
    asyncHandler(async (req, res, next) => {
        await getNewsList(async (data) => {
            if (data) {
                await res.json({ data });
            } else {
                next();
            }
        });
}));

module.exports = router;