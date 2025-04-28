const baseURL = "http://localhost:5000"; 

const getAllOrders = (token) => {
  return fetch(`${baseURL}/api/order`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

const getOrderById = (orderHash, token) => {
  return fetch(`${baseURL}/api/order/${orderHash}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

const createOrder = (orderData, token) => {
  return fetch(`${baseURL}/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      employee_id: orderData.employee_id,
      customer_id: orderData.customer_id,
      vehicle_id: orderData.vehicle_id,
      order_description: orderData.notes,
      estimated_completion_date: orderData.estimated_completion_date,
      order_services: orderData.service_ids.map((id) => ({ service_id: id })),
    }),
  });
};




const orderService = {
  getAllOrders,
  getOrderById,
  createOrder,
 
};

export default orderService;
