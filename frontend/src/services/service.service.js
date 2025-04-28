const api_url = process.env.REACT_APP_API_URL;

const createService = async (formData, token) => {
  const response = await fetch(`${api_url}/api/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(formData),
  });
  console.log(formData);
  console.log(response);
  return response;
};

const getAllServices = async (token) => {
  const response = await fetch(`${api_url}/api/services`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
  return response;
};

const serviceService = {
  createService,
  getAllServices,
};

export default serviceService;
