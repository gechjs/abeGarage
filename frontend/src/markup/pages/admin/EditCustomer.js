import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../../Contexts/AuthContext";
import customerService from "../../../services/customer.service";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import Swal from 'sweetalert2';

const EditCustomer = () => {
  const { id } = useParams();
  const { employee } = useAuth();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    active_status: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const token = employee ? employee.employee_token : null;

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!token) return;

      try {
        setInitialLoading(true);
        const res = await customerService.getCustomerById(id, token);
        if (!res.ok) {
          const errorMessage = await res.text();
          console.error("Error fetching customer:", res.status, errorMessage);
          setError(`Failed to fetch customer details. Status: ${res.status}`);
          return;
        }
        const data = await res.json();
        setCustomerData({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          active_status: data.active_status,
        });
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Failed to fetch customer details. An unexpected error occurred.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setCustomerData((prevData) => ({
      ...prevData,
      active_status: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const res = await customerService.updateCustomer(id, customerData, token);
      if (res.ok) {
        await Swal.fire({
          title: '✅ Success!',
          text: 'Customer updated successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        navigate("/admin/customers");
      } else {
        const errorData = await res.text();
        console.error("Failed to update customer:", res.status, errorData);
        await Swal.fire({
          title: '❌ Error!',
          text: `Failed to update customer details. Status: ${res.status}. ${errorData}`,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      await Swal.fire({
        title: '❌ Error!',
        text: 'An unexpected error occurred while updating the customer.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token || initialLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary" />
        <div className="mt-2">Loading customer details...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <div className="input-group mt-5 ml-3 mr-3 pr-5"></div>

          <div className="p-4 shadow rounded bg-light">
            <h2 className="mb-4 text-primary">Edit Customer</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="first_name" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={customerData.first_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="last_name" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={customerData.last_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="phone_number" className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={customerData.phone_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="active_status" className="mb-4">
                <Form.Check
                  type="checkbox"
                  label="Active Status"
                  name="active_status"
                  checked={customerData.active_status}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading} className="w-100">
                {loading ? <Spinner animation="border" size="sm" as="span" className="me-2" /> : null}
                {loading ? "Updating Customer..." : "Update Customer"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;