//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { requireAuth } = require("../auth");
const { Watchlist, User, Company } = require("../db/models");
const { Op } = require("sequelize");
//const cors = require("cors");

const router = express.Router();

//router.options("/", cors());

router.post(
    "/:userid",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const company = req.body;
        const companyId = await Company.findOne({where: { symbol: company.symbol }});
        if(companyId){
            const watchlist = await Watchlist.create({ companyId: companyId.id , userId: req.params.userid })
            res.json({ watchlist });
        } else {
            next(stockNotFoundError(company));
        };
}));

router.get(
    "/:userid",
    requireAuth,
    asyncHandler(async(req, res, next)=> {
        const watchlists = await Watchlist.findAll({
        where: {
            userId: req.params.userid,
        },
        include: Company
        });
    // Need to implement an error handler here
    res.json( { watchlists});
}));

router.delete(
    "/:stockId",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const deleteCompany = req.params.stockId;
        const user = req.body;
        console.log(deleteCompany, user);
        const watchlist = await Watchlist.findOne({
            where: {
                [Op.and]: [
                    { userId: user.userId },
                    { companyId: deleteCompany }
                ]
            },
        });
        if (watchlist) {
            await watchlist.destroy();
            res.json({ message: `Removed Company ${req.params.stockId} from your watchlist.` });
        } else {
            next(stockNotFoundError(req.params.stockSymbol));
        }
}));

module.exports = router;