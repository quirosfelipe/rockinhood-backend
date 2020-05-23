//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { Company } = require("../db/models");
const { stockHistoricalPrices, getNewsList } = require("./yahoo-api")
const { Op } = require("sequelize");

const router = express.Router();


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

//ROUTE RETURNS LIST OF ALL COMPANIES AND THEIR SYMBOLS
router.get(
    "/allcompanies/",
    asyncHandler(async (req, res, next) => {
        const companies = await Company.findAll();
        const companyData = companies.map( (ele) => {
            return { name: ele.name , symbol: ele.symbol }});

        res.json({ companyData });
    }));


// ROUTE RETURN COMPANY INFO
router.get(
    "/:stock",
    asyncHandler(async(req, res, next) => {

        const stock = await Company.findOne({
            where: {
                [Op.or]: [
                    { name: req.params.stock },
                    { symbol: req.params.stock }
                ]
            },
        });
        if (stock) {
            res.json({ stock });    
        } else {
            next(stockNotFoundError(req.params.stock));
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
    

module.exports = router;

// // ROUTE RETURNS FINANCIAL NEWS
// router.get(
//     "/news",
//     asyncHandler(async (req, res, next) => {
//         await getNews(async (data) => {
//             if (data) {
//                 await res.json({ data });
//             } else {
//                 next();
//             }
//         });
//     }));