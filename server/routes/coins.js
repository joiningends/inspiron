const express = require('express');
const router = express.Router();
const coinController = require('../controller/coinController');


router.get('/:userId', coinController.getCoinByUserId);
router.put('/:id', coinController.updateCoinBalance)
module.exports = router;
