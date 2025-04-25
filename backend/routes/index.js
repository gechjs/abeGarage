const express = require('express');
const router = express.Router();

const installRouter = require('./install.routes');
const employeeRouter = require('./employee.routes');
const loginRoutes = require("./login.routes");
const customerRouter = require('./customer.routes');
const serviceRouter = require('./service.routes');
const vehicleRouter = require('./vehicle.routes');  
const orderRouter = require("./order.routes")
router.use(installRouter);
router.use(employeeRouter);
router.use(customerRouter);
router.use(loginRoutes);
router.use(serviceRouter);
router.use(orderRouter)
router.use(vehicleRouter); 

module.exports = router;
