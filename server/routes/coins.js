const express = require('express');
const router = express.Router();
const coinController = require('../controller/coinController');

// POST request to create a new Coin document
router.post('/', coinController.createCoin);

module.exports = router;
