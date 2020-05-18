//REQUIRED PACKAGES
const express = require('express');
const bcrypt = require('bcryptjs')
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require("../utils");

const router = express.Router();

router.post("/");

router.get("/:id");

router.put("/:id");

router.delete('/:id');

module.exports = router;