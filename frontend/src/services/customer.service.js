const api_url = process.env.REACT_APP_API_URL;

const createCustomer = async (formData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(formData),
  };

  console.log('Sending request to create customer:', requestOptions);
  const response = await fetch(`${api_url}/api/customer`, requestOptions);
  return response;
};

const getAllCustomers = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/customers`, requestOptions);
  return response;
};

const getCustomerById = async (customerId, token) => {
  console.log("token", token);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/customer/${customerId}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch customer');
  }

  return response;
};

const getCustomerVehicles = async (customerId, token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/vehicles/${customerId}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch customer vehicles');
  }

  const data = await response.json();

  // Assuming the API returns an object where vehicle arrays might be properties
  let vehicles = [];
  for (const key in data) {
    if (Array.isArray(data[key])) {
      vehicles = data[key];
      break; // Assuming there's only one array of vehicles
    }
  }

  return vehicles;
};

const createOrder = async (orderData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      employee_id: orderData.employee_id,
      customer_id: orderData.customer_id,
      vehicle_id: orderData.vehicle_id,
      order_description: orderData.notes,
      estimated_completion_date: orderData.estimated_completion_date,
      price: orderData.price,
      order_services: orderData.service_ids.map(serviceId => ({
        service_id: serviceId,
      })),
    }),
  };
  

  console.log('Sending request to create order:', requestOptions);
  const response = await fetch(`${api_url}/api/order`, requestOptions);
  return response;
};

const getAllServices = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/services`, requestOptions);
  return response;
};

const customerService = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerVehicles,
  createOrder,
  getAllServices,
};

export default customerService;