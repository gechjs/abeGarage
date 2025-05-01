const api_url = process.env.REACT_APP_API_URL;

const addVehicle = async (customerId, vehicleData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(vehicleData),
  };
  console.log("request option body", requestOptions.body);

  const response = await fetch(`${api_url}/api/vehicle`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add vehicle');
  }

  return response;
};


const getAllVehicles = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/vehicles`, requestOptions); 
  

  return response;
};

const vehicleService = {
  addVehicle,
  getAllVehicles, 
};

export default vehicleService;
