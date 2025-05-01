const api_url = process.env.REACT_APP_API_URL;
const getAllOrders = (token) => {
   const response = fetch(`${api_url}/api/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  console.log(response)
  return response
};


const getOrderById = (orderHash, token) => {
  return fetch(`${api_url}/api/order/${orderHash}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};


const createOrder = (orderData, token) => {
  return fetch(`${api_url}/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      employee_id: orderData.employee_id,
      customer_id: orderData.customer_id,
      vehicle_id: orderData.vehicle_id,
      order_description: orderData.order_description, 
      estimated_completion_date: orderData.estimated_completion_date,
      price: orderData.price, 
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