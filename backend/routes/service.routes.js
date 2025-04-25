const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/api/services", [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.createService);
router.get("/api/services", [authMiddleware.verifyToken], serviceController.getAllServices);

module.exports = router;
