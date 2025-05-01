import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import { Form, Button, Alert, Spinner, Card, Container } from "react-bootstrap"; 
import { FaEdit, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../../Contexts/AuthContext";
import employeeService from "../../../services/employee.service";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import Swal from 'sweetalert2';  

const EditEmployee = () => {
  const { id } = useParams();
  const { employee } = useAuth();
  const navigate = useNavigate(); 
  
  const [employeeData, setEmployeeData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    active_status: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); 

  const token = employee ? employee.employee_token : null;

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!token) return; 

      try {
        setInitialLoading(true); 
        const res = await employeeService.getEmployeeById(id, token);
        const data = await res.json();
        setEmployeeData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          active_status: data.active_status,
        });
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to fetch employee details");
      } finally {
        setInitialLoading(false); 
      }
    };

    fetchEmployeeDetails();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      active_status: e.target.checked,
    }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await employeeService.updateEmployee(id, employeeData, token);
    if (res.ok) {
      await Swal.fire({
        title: 'Success!',
        text: 'Employee updated successfully.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      navigate("/admin/employees"); // Navigate after user clicks OK
    } else {
      setError("Failed to update employee details");
    }
  } catch (err) {
    console.error("Error updating employee:", err);
    setError("An error occurred while updating the employee");
  } finally {
    setLoading(false);
  }
};


  if (!token || initialLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <div>Loading employee details...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side d-flex justify-content-center align-items-center">
          <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card className="shadow p-4">
              <h2 className="text-center mb-4 text-primary" style={{ fontWeight: "bold" }}>
                <FaEdit style={{ marginBottom: "5px" }} /> Edit Employee
              </h2>

              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="first_name" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={employeeData.first_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="last_name" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={employeeData.last_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={employeeData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={employeeData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="role" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={employeeData.role}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="active_status" className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Active Status"
                    name="active_status"
                    checked={employeeData.active_status}
                    onChange={handleCheckboxChange}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success" 
                    type="submit" 
                    disabled={loading}
                    style={{ fontWeight: "bold", padding: "10px 0", fontSize: "16px" }}
                  >
                    {loading ? "Updating..." : (
                      <>
                        <FaCheckCircle style={{ marginBottom: "3px", marginRight: "5px" }} />
                        Update Employee
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
