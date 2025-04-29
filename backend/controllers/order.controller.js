const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
  console.log("createOrder controller called");
  
  try {
    const {
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      estimated_completion_date,
      price,
      service_ids,
      completion_date = null,        
      order_completed = false      
    } = req.body;

    console.log("Incoming request body:", req.body);

    const requiredFields = {
      employee_id: 'Employee ID',
      customer_id: 'Customer ID',
      vehicle_id: 'Vehicle ID',
      service_ids: 'Service IDs',
      estimated_completion_date: 'Estimated completion date',
      price: 'Price'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([_, name]) => name);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        missingFields: missingFields.join(', ')
      });
    }

    if (!Array.isArray(service_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Service IDs must be provided as an array'
      });
    }

    if (service_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service must be selected'
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    const orderData = {
      employee_id,
      customer_id,
      vehicle_id,
      order_description: order_description || null,
      estimated_completion_date,
      completion_date,
      order_completed,
      service_ids,
      price: parseFloat(price).toFixed(2) 
    };

    console.log("Processing order creation with data:", orderData);
    
    const newOrder = await orderService.createOrder(orderData);
    
    if (!newOrder) {
      throw new Error('Order creation failed - no response from service');
    }

    console.log("Order successfully created with ID:", newOrder.order_id);
    
    res.status(201).json({ 
      success: true,
      message: 'Order created successfully', 
      data: {
        order_id: newOrder.order_id,
        order_hash: newOrder.order_hash,
        customer_id: newOrder.customer_id,
        vehicle_id: newOrder.vehicle_id,
        services: service_ids,
        price: newOrder.price,
        status: order_completed ? 'Completed' : 'Pending',
        estimated_completion: estimated_completion_date
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    
    const statusCode = error.message.includes('validation') || 
                       error.message.includes('required') ? 400 : 500;
    
    res.status(statusCode).json({ 
      success: false,
      message: 'Order creation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createOrder
};