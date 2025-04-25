// customer.routes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/api/customer", [authMiddleware.verifyToken], customerController.createCustomer);
router.get("/api/customers", [authMiddleware.verifyToken], customerController.getAllCustomers);

router.get("/api/customer/:customerId", [authMiddleware.verifyToken], customerController.getCustomerById);

router.get("/api/customers/search", [authMiddleware.verifyToken], customerController.searchCustomers);

module.exports = router;
