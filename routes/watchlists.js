//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { requireAuth } = require("../auth");
const { Watchlist, User, Company } = require("../db/models");

const router = express.Router();


router.post(
    "/:id",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const { company } = req.body;
        const companyId = await Company.findOne({where: { name: company }});
        if(companyId){
            const watchlist = await Watchlist.create({ companyId: companyId.id , userId: req.params.id })
            res.json({ watchlist });
        } else {
            next(stockNotFoundError(company));
        };
}));

router.get(
    "/:id",
    requireAuth,
    asyncHandler(async(req, res, next)=> {
        const watchlists = await Watchlist.findAll({
        where: {
            userId: req.params.id,
      },
    });
    // Need to implement an error handler here
    res.json( { watchlists});
}));

router.delete(
    "/:stockSymbol",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        const deleteCompany = req.params.stockSymbol;
        const watchlist = await Watchlist.findOne({ where: { companyId: deleteCompany }});
        if (watchlist) {
            await watchlist.destroy();
            res.json({ message: `Removed Company ${req.params.stockSymbol} from your watchlist.` });
        } else {
            next(stockNotFoundError(req.params.stockSymbol));
        }
}));

module.exports = router;