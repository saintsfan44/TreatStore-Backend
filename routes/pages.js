const express = require('express');

const { homeCtrlFunction, cartCtrlFunction, candyCtrlFunction } = require('../controllers/pagesCtrlFile');

const router = express.Router();

router.get('/', homeCtrlFunction);
router.get('/cart', cartCtrlFunction);
router.get('/candy', candyCtrlFunction);

module.exports = router;