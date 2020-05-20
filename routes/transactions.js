//REQUIRED PACKAGES
const express = require('express');
const { asyncHandler, stockNotFoundError } = require("../utils");
const { requireAuth } = require("../auth");
const { Watchlist, Company, User } = require("../db/models");

const router = express.Router();



router.post(
    "/:id",
    requireAuth,
    asyncHandler(async(req, res, next) => {
        
}));

router.put("/:id");


module.exports = router;