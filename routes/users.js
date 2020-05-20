//REQUIRED PACKAGES
const express = require('express');
const bcrypt = require('bcryptjs')
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require("../utils");
const { getUserToken, requireAuth } = require("../auth");
const { User } = require("../db/models");

const router = express.Router();

const validateName = [
    check("fullName")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a username"),
    handleValidationErrors,
];
const validateEmailAndPassword = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors,
];

router.post(
    "/", 
    validateName,
    validateEmailAndPassword,
    asyncHandler(async(req, res, next)=> {
        const { fullName, email, cashBalance, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, email, cashBalance, hashedPassword });

        const token = getUserToken(user);
        res.status(201).json({
            user: { id: user.id },
            token,
        });
}));

router.get("/:id");

router.put("/:id");

router.delete('/:id');

module.exports = router;