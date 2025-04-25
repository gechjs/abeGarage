require('dotenv').config();
const jwt = require("jsonwebtoken");

const employeeService = require("../services/employee.service");

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
 
  if (!token) {
    
    console.log("no token")
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }
    
   
    req.employee_email = decoded.employee_email;
    console.log("verified")
    next();
  });
}

const isAdmin = async (req, res, next) => {
 
  console.log(req.employee_email);
  const employee_email = req.employee_email;
  const employee = await employeeService.getEmployeeByEmail(employee_email);
  if (employee[0].company_role_id === 3) {
   console.log("is admin")
    next();
  } else {
    console.log("not admin")
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin!"
    });
  }
}

const authMiddleware = {
  verifyToken,
  isAdmin
}

module.exports = authMiddleware;