const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/api/order', [authMiddleware.verifyToken], orderController.createOrder);

module.exports = router;
