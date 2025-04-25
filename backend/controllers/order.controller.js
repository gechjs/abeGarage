const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
  console.log("createOrder called");
  
  try {
      const {
          customer_id,
          vehicle_id,
          price,
          notes,
          estimated_completion_date,
        } = req.body;
        const service_ids = [12, 14]

    console.log("customer id",customer_id);
    console.log("vehicle id", vehicle_id);
    console.log(service_ids)
    if (!customer_id || !vehicle_id || !service_ids || !estimated_completion_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure serviceIds is an array and not empty
    // if (!Array.isArray(service_ids) || service_ids.length === 0) {
    //   return res.status(400).json({ message: 'Invalid service IDs' });
    // }

    const orderData = {
      customer_id,
      vehicle_id,
      service_ids: JSON.stringify(service_ids),
      notes,
      estimated_completion_date,
      price
    };
    console.log("create order called")

    const newOrder = await orderService.createOrder(orderData);
    console.log("order created")
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
};
