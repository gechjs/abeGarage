const express = require('express');
const router = express.Router(); 
const installRouter = require('./install.routes');
const employeeRouter = require('./employee.routes');
router.use(installRouter);
router.use(employeeRouter);
module.exports = router; 
