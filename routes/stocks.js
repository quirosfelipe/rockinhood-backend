//REQUIRED PACKAGES
const express = require('express');

const router = express.Router();

router.get('/:stockSymbol');

module.exports = router;