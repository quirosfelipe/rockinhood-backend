//REQUIRED PACKAGES
const express = require('express');
const bcrypt = require('bcryptjs')
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require("../utils");
const { getUserToken, requireAuth } = require("../auth");
const { User, Watchlist, Transaction, } = require("../db/models");

const router = express.Router();

const validateName = [
    check("fullName")
        .exists({ checkFalsy: true })
        .withMessage("Please provide your full name"),
    handleValidationErrors,
];
const validateEmailAndPassword = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password.")
        .isLength({ max: 50 })
        .withMessage('Password must not be more than 50 characters long'),
    handleValidationErrors,
];

const guestUserToDefault = async(user) => {
    
    //below code resets Watchlist for guest login
    const clearWatchlist = await Watchlist.destroy({ where: { userId: 1 } });
    console.log("Guest user watchlist cleared")
    const defaultWatchlist1 = await Watchlist.create({ userId: 1, companyId: 1 });
    const defaultWatchlist2 = await Watchlist.create({ userId: 1, companyId: 3 });
    const defaultWatchlist3 = await Watchlist.create({ userId: 1, companyId: 7 });
    //below code resets Transactions for guest login
    const clearTransactions = await Transaction.destroy({ where: { userId: 1 } });
    console.log("Guest Transactions cleared")
    const defaultStock1 = await Transaction.create({ userId: 1, companyId: 14, shares: 10, price: 5.62, buySell: true });
    const defaultStock2 = await Transaction.create({ userId: 1, companyId: 5, shares: 20, price: 6.38, buySell: true });
    const defaultStock3 = await Transaction.create({ userId: 1, companyId: 19, shares: 5, price: 31.71, buySell: true });
};

//CREATE BEW USER ROUTE
router.post(
    "/", 
    validateName,
    validateEmailAndPassword,
    asyncHandler(async(req, res, next)=> {
        const { fullName, email, password } = req.body;  //
        const cashBalance = 1000;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, email, cashBalance, hashedPassword });

        const defaultWatchlist1 = await Watchlist.create({ userId: user.id, companyId: 1 });
        const defaultWatchlist2 = await Watchlist.create({ userId: user.id, companyId: 9 });
        const defaultWatchlist3 = await Watchlist.create({ userId: user.id, companyId: 19 });
        
        const token = getUserToken(user);
        res.status(201).json({ token, user: { id: user.id, cashBalance: user.cashBalance }});
           
}));

//USER LOGIN ROUTE
router.post(
    "/token",
    validateEmailAndPassword,
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email },
        });

    if (!user || !user.validatePassword(password)) {
        const err = new Error("Login failed");
        err.status = 401;
        err.title = "Login failed";
        err.errors = ["The provided credentials were invalid."];
        return next(err);
    }
    if(user.id = 1) {
        user.cashBalance = 10000;
        await user.save();
        console.log(`User ${user.fullName} logged in with cash balance of ${user.cashBalance}`)
        guestUserToDefault();
    }

        console.log(`User ${user.fullName} logged in!`)
    const token = getUserToken(user);
        res.json({ token, user: { id: user.id, cashBalance: user.cashBalance}});
    })
);  

//GUEST USER LOGIN ROUTE
router.post(
    "/guest",
    asyncHandler(async (req, res, next) => {
        const email = "guest@guest.com";
        const password = "guest";
        const user = await User.findOne({
            where: { email } },
        );

        if (!user || !user.validatePassword(password)) {
            const err = new Error("Login failed");
            err.status = 401;
            err.title = "Login failed";
            err.errors = ["The provided credentials were invalid."];
            return next(err);
        }
        user.cashBalance = 10000;
        await user.save();
        console.log(`User ${user.fullName} logged in with cash balance of ${user.cashBalance}`)
        guestUserToDefault();

        const token = getUserToken(user);
        res.json({ token, user: { id: user.id, cashBalance: user.cashBalance } });
    })
);  

//  update user info route router.put("/:id");

//  delete user route router.delete('/:id');

module.exports = router;