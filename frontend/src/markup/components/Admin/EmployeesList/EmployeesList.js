import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Badge, Spinner, Alert, Pagination, Form } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import employeeService from "../../../../services/employee.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaTrash, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import { debounce } from 'lodash'; // Import debounce

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    setApiErrorMessage(null);
    try {
      const res = await employeeService.getAllEmployees(token);
      if (!res.ok) {
        setApiError(true);
        if (res.status === 401) {
          setApiErrorMessage("Please login again");
        } else if (res.status === 403) {
          setApiErrorMessage("You are not authorized to view this page");
        } else {
          setApiErrorMessage("Failed to fetch employees. Please try again later.");
        }
        return;
      }
      const data = await res.json();
      if (data && data.data) {
        setEmployees(data.data);
      } else {
        setApiErrorMessage("No employees found.");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setApiError(true);
      setApiErrorMessage("Failed to fetch employees. An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Debounced search function
  const debouncedFetchEmployees = useCallback(
    debounce(() => {
      fetchEmployees(); // Re-fetch employees when search term changes (you might want to adjust this to filter on the client-side if the dataset is small enough)
    }, 300),
    [fetchEmployees]
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedFetchEmployees(); // Trigger debounced fetch
  };

  // Filtering logic
  const filteredEmployees = employees.filter(emp =>
    emp.employee_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.company_role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (employeeId) => {
    navigate(`/admin/employee/edit/${employeeId}`);
  };

  const handleDelete = (employeeId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this employee?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await employeeService.deleteEmployee(employeeId, token);
              if (res.ok) {
                toast.success("Employee deleted successfully!", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
                fetchEmployees();
              } else {
                const errorData = await res.json();
                toast.error("Failed to delete employee: " + (errorData.message || "Unknown error"), {
                  position: "top-center",
                  theme: "colored",
                });
              }
            } catch (error) {
              console.error("Error deleting employee:", error);
              toast.error("An error occurred while deleting the employee.", {
                position: "top-center",
                theme: "colored",
              });
            }
          }
        },
        {
          label: 'No',
        }
      ]
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading employees...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          {apiErrorMessage}
        </Alert>
      </div>
    );
  }

  return (
    <>
      <section className="contact-section">
        <div className="auto-container">
          <div className="contact-title mb-4 d-flex justify-content-between align-items-center">
            <h2 className="text-primary">Employee Management</h2>
           
          </div>
          
          <p className="text-muted mb-3">View and manage your organization's employees</p>
        <div>
        <Form.Control
              //increase the with 
              style={{ width: "300px", paddingLeft: "40px", marginBottom: "20px" , marginRight: "auto", marginTop: "40px"}} 

              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-auto"
            />
        </div>
          {filteredEmployees.length === 0 && searchTerm ? (
            <Alert variant="info" className="text-center">
              No employees found matching your search criteria.
            </Alert>
          ) : filteredEmployees.length === 0 ? (
            <Alert variant="info" className="text-center">
              No employees found. Add your first employee to get started.
            </Alert>
          ) : (
            <>
              <Table striped bordered hover responsive className="shadow-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Status</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Added Date</th>
                    <th>Role</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <tr key={employee.employee_id}>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          {employee.active_employee ? (
                            <FaUserCheck className="text-success me-2" />
                          ) : (
                            <FaUserSlash className="text-secondary me-2" />
                          )}
                          <Badge
                            pill
                            bg={employee.active_employee ? "success" : "secondary"}
                            className="text-uppercase"
                          >
                            {employee.active_employee ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </td>
                      <td className="align-middle">{employee.employee_first_name}</td>
                      <td className="align-middle">{employee.employee_last_name}</td>
                      <td className="align-middle text-primary">{employee.employee_email}</td>
                      <td className="align-middle">{employee.employee_phone}</td>
                      <td className="align-middle text-muted">
                        {format(new Date(employee.added_date), 'MMM dd, yyyy | hh:mm a')}
                      </td>
                      <td className="align-middle">
                        <Badge bg="info" className="text-dark">
                          {employee.company_role_name}
                        </Badge>
                      </td>
                      <td className="align-middle text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(employee.employee_id)}
                          className="d-flex align-items-center justify-content-center gap-1 mx-auto"
                        >
                          <FaEdit />
                        </Button>
                      </td>
                      <td className="align-middle text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(employee.employee_id)}
                          className="d-flex align-items-center justify-content-center gap-1 mx-auto"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => paginate(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default EmployeesList;