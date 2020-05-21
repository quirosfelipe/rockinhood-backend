//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { requireAuth } = require("../auth");
const { stockHistoricalPrices } = require("./yahoo-api")
const { Company, User, Transactions } = require("../db/models");

const router = express.Router();



router.post(
    "/:userid",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const { company, shares, price } = req.body;
        const companyId = await Company.findOne({ where: { name: company } });
        
        if(!companyId) {
            next(stockNotFoundError(company));
        } else {
            const purchasePrice = price * shares;
            const userfunds = await User.findByPK(req.params.userId)

            if(userfunds.cashBalance > purchasePrice) {
            const transaction = await Transactions.create({ companyId: companyId.id, 
                userId: req.params.userid, shares: shares, price: purchasePrice, buySell: true });
            
            } else {

            };
        };
}));

router.get("/:id")

router.put("/:id");


module.exports = router;