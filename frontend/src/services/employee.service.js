const api_url = process.env.REACT_APP_API_URL;

// A function to send post request to create a new employee 
const createEmployee = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': loggedInEmployeeToken
    },
    body: JSON.stringify(formData)
  };
  console.log(requestOptions);
  const response = await fetch(`${api_url}/api/employee`, requestOptions);
  return response;
}

// A function to send get request to get all employees
const getAllEmployees = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  };
  const response = await fetch(`${api_url}/api/employees`, requestOptions);
  return response;
}

// A function to get an employee by ID
const getEmployeeById = async (employeeId, token) => {
  console.log("token", token);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/employee/${employeeId}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch employee');
  }

  return response;
};

// A function to update an employee
const updateEmployee = async (employeeId, formData, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(formData),
  };

  console.log('Sending request to update employee:', requestOptions);
  console.log("employeeId", employeeId);

  const response = await fetch(`${api_url}/api/employee/${employeeId}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update employee');
  }

  return response; 
};

const deleteEmployee = async (employeeId, token) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
  };

  const response = await fetch(`${api_url}/api/employee/${employeeId}`, requestOptions);
  return response;
};

const employeeService = {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee   
}

export default employeeService;
