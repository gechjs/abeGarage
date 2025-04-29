const connection = require("../config/db.config");
const { v4: uuidv4 } = require('uuid');

const createOrder = async (orderData) => {
  let conn;
  try {
    conn = await connection.getConnection();
    await conn.beginTransaction();

    const {
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      estimated_completion_date,
      price,
      service_ids
    } = orderData;
{ employee_id,
  customer_id,
  vehicle_id,
  order_description,
  estimated_completion_date,
  price,
  service_ids}
   
    const orderHash = uuidv4();


    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        employee_id, 
        customer_id, 
        vehicle_id, 
        order_date, 
        active_order, 
        order_hash
      ) VALUES (?, ?, ?, NOW(), 1, ?)`,
      [employee_id, customer_id, vehicle_id, orderHash]
    );

    const orderId = orderResult.insertId;

   
    await conn.query(
      `INSERT INTO order_info (
        order_id,
        order_total_price,
        estimated_completion_date,
        completion_date,
        additional_request,
        notes_for_internal_use,
        notes_for_customer,
        additional_requests_completed
      ) VALUES (?, ?, ?, NULL, ?, ?, NULL, 0)`,
      [
        orderId,
        price,
        estimated_completion_date,
        order_description || 'No additional request',
        order_description || 'No internal notes'
      ]
    );

    const servicesArray = Array.isArray(service_ids) 
      ? service_ids 
      : JSON.parse(service_ids || '[]');

    for (const serviceId of servicesArray) {
      await conn.query(
        `INSERT INTO order_services (
          order_id,
          service_id,
          service_completed
        ) VALUES (?, ?, 0)`,
        [orderId, serviceId]
      );
    }

  
    await conn.query(
      `INSERT INTO order_status (
        order_id,
        order_status
      ) VALUES (?, 0)`,
      [orderId]
    );

    await conn.commit();

    return { 
      success: true,
      order_id: orderId,
      order_hash: orderHash,
      employee_id,
      customer_id,
      vehicle_id,
      price,
      estimated_completion_date,
      services: servicesArray
    };

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Error in orderService.createOrder:', error);
    throw error; 
  } finally {
    if (conn) conn.release(); 
  }
};

module.exports = {
  createOrder
};