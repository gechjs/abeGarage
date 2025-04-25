const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/api/vehicles/:customerId', [authMiddleware.verifyToken], vehicleController.getVehiclesByCustomerId);

router.post('/api/vehicle', [authMiddleware.verifyToken], vehicleController.addVehicle);

module.exports = router;
