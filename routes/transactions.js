//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { requireAuth } = require("../auth");
const { stockHistoricalPrices } = require("./yahoo-api")
const { Company, User, Transaction } = require("../db/models");

const router = express.Router();


//ROUTE TO PURCHASE STOCK
router.post(
    "/:userId",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const { company, shares, price } = req.body;
        const companyId = await Company.findOne({ where: { name: company } });
         
        if(!companyId) {
            next(stockNotFoundError(company));
        } else {
            const purchasePrice = price * shares;
            const userfunds = await User.findOne({where: { id: req.params.userId}});
          
            if(userfunds.cashBalance > purchasePrice) {
            const transaction = await Transaction.create({ companyId: companyId.id, 
                userId: req.params.userId, shares: shares, price: purchasePrice, buySell: true });
                // UPDATE CASHBALANCE FOR PURCHASE BELOW
                userfunds.cashBalance -= purchasePrice;
                await userfunds.save();
                res.status(201).json( {userfunds: { id: userfunds.id, cashBalance: userfunds.cashBalance }});
            } else {
                const err = new Error("Transaction failed");
                err.status = 400;
                err.title = "Transaction failed";
                err.errors = ["Unsufficent funds in account to make this transaction."];
                return next(err);
            };
        };
}));

//ROUTE TO GET ALL PURCHASED STOCKS FOR A USER
router.get(
    "/:userId",
    requireAuth,
    asyncHandler(async (req, res, next) => {
        const transactions = await Transaction.findAll({
            where: {
                userId: req.params.userId,
                buySell: true,
            },
            include: Company
        });
        if(!transactions){
            const err = new Error("Could not find transactions");
            err.status = 404;
            err.title = "Transactions not found";
            err.errors = ["Could not find any transaciots for specified user."];
            return next(err);
        } else {
            res.status(200).json({ transactions });
        };
}));

//ROUTE TO SELL A STOCK
router.put(
    "/:stockSymbol",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const { price, shares} = req.body;

        console.log(price, shares);

        if(shares <= 0) {
            const err = new Error("Must own at least one share to sell");
            err.status = 404;
            err.title = "Transaction failed";
            err.errors = ["Must own at least one share to sell stock"];
            return next(err);
        }

        const company = await Company.findOne({where: { symbol: req.params.stockSymbol }});
        const transaction = await Transaction.findOne({ where: { companyId: company.id}});
        const user = await User.findOne({where:{ id: transaction.userId }});
        const salePrice = transaction.shares * price;

        if(shares > transaction.shares) {
            const err = new Error("Too many shares entered");
            err.status = 404;
            err.title = "Transaction failed";
            err.errors = ["Can not sell more shares than you own!"];
            return next(err);
        };
        if (!transaction) {
            const err = new Error("Could not find transactions");
            err.status = 404;
            err.title = "Transactions not found";
            err.errors = ["Could not find any transaciots for specified user."];
            return next(err);
        }; 
        transaction.buySell = false;
        transaction.price = price;
        await transaction.save();
        user.cashBalance += salePrice;
        await user.save();
        res.status(200).json({ transaction });
}));

//ROUTE TO ADD USER CASH
router.post(
    "/fund/:userId",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const userfunds = await User.findOne({ where: { id: req.params.userId } });
        const { funds } = req.body;

        if (funds < 1) {
            const err = new Error("Could not fund account");
            err.status = 404;
            err.title = "Incorrect Value Input";
            err.errors = ["Funding value must be a positive value greater than $0"];
            return next(err);
        } else {
            userfunds.cashBalance += funds;
            await userfunds.save();
            res.status(200).json({ message: "Funds updated!" });
        };
}));


module.exports = router;