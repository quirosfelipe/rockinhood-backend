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
                userfunds.cashBalance -= purchasePrice;
                await userfunds.save();
                res.status(201).json({ message: `${shares} shares of ${companyId.name} stock was purchased for $${purchasePrice}!`});
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

//TPUTE TO SELL A STOCK
router.put(
    "/:stockSymbol",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const { price } = req.body;
        const company = await Company.findOne({where: { symbol: req.params.stockSymbol }});
        const transaction = await Transaction.findOne({ where: { companyId: company.id}});
        const user = transaction.userId;
        const salePrice = transaction.shares * price;
        
        if (!transactions) {
            const err = new Error("Could not find transactions");
            err.status = 404;
            err.title = "Transactions not found";
            err.errors = ["Could not find any transaciots for specified user."];
            return next(err);
        } else {
            transaction.buySell = false;
            await transaction.save();
            user.cashBalance += salePrice;
            await user.save();
            res.status(200).json({ transaction });
        };

}));


module.exports = router;