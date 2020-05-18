//REQUIRED PACKAGES
const express = require('express');
const bcrypt = require('bcryptjs')
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require("../utils");

const router = express.Router();

routes.post("/");

routes.get("/:id");

routes.put("/:id");

routes.delete('/:id');

module.exports = router;