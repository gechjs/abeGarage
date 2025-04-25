const customerService = require('../services/customer.service');

async function createCustomer(req, res, next) {
  const customerExists = await customerService.checkIfCustomerExists(req.body.customer_email);

  if (customerExists) {
    res.status(400).json({
      error: "This email address is already associated with another customer!"
    });
  } else {
    try {
      const customerData = req.body;
      const customer = await customerService.createCustomer(customerData);
      if (!customer) {
        res.status(400).json({
          error: "Failed to add the customer!"
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "Something went wrong!"
      });
    }
  }
}

async function getAllCustomers(req, res, next) {
  const customers = await customerService.getAllCustomers();

  if (!customers) {
    res.status(400).json({
      error: "Failed to get all customers!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: customers,
    });
  }
}

async function getCustomerById(req, res, next) {
  const customerId = req.params.customerId;

  try {
    const customer = await customerService.getCustomerById(customerId);
    
    if (!customer) {
      return res.status(404).json({
        error: "Customer not found!"
      });
    }

    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong while fetching customer!"
    });
  }
}

async function searchCustomers(req, res, next) {
  const searchQuery = req.query.query;  // Query param from the request
  try {
    const customers = await customerService.searchCustomers(searchQuery);

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        error: "No customers found matching the search criteria!"
      });
    }

    res.status(200).json({
      status: "success",
      data: customers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong while searching for customers!"
    });
  }
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  searchCustomers, 
};
