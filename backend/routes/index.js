// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the install router 
const installRouter = require('./install.routes');

const employeeRouter = require('./employee.routes');
router.use(installRouter);
router.use(employeeRouter);
module.exports = router; 