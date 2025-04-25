const connection = require("../config/db.config");
const { v4: uuidv4 } = require('uuid');

const createOrder = async ({ customer_id, price, vehicle_id, service_ids, notes, estimated_completion_date }) => {
 
  try {
   
    console.log("order service called")
    const [employee] = await connection.query('SELECT employee_id FROM employee WHERE employee_email = ?', ['gizachew980@gmail.com']); 
    console.log(employee)
    const employeeId = employee.employee_id;
    const orderHash = uuidv4(); 
   
    const customerId = customer_id
    const vehicleId = vehicle_id
    const serviceIds = service_ids
    const estimatedCompletionDate = estimated_completion_date

    console.log("quer for orders called")
    const response = await connection.query(
      `INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [employeeId, customerId, vehicleId, 1, orderHash]
    );
    console.log("response", response)
    const orderId = response.orderResult.insertId;

    // 2. Insert into `order_info`
    await connection.query(
      `INSERT INTO order_info (order_id, order_total_price, estimated_completion_date, completion_date, additional_request, notes_for_customer, notes_for_internal_use, additional_requests_completed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, price, estimatedCompletionDate,estimatedCompletionDate, 'no request', notes, 'be fast', 0]
    );

    // 3. Insert into `order_services`
    for (const serviceId of JSON.parse(serviceIds)) {
      await connection.query(
        `INSERT INTO order_services (order_id, service_id, service_completed)
         VALUES (?, ?, ?)`,
        [orderId, serviceId, 0]
      );
    }

   
    await connection.query(
      `INSERT INTO order_status (order_id, order_status)
       VALUES (?, ?)`,
      [orderId, 0]
    );

    await connection.commit();
    return { orderId, orderHash };

  } catch (err) {
    console.log("error")
  }
};

module.exports = {
    createOrder
  };
  