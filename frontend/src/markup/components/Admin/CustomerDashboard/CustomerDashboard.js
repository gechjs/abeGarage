import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Form, Alert, Table } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../../../Contexts/AuthContext";
import customerService from "../../../../services/customer.service";
import vehicleService from "../../../../services/vehicle.service";
import "./style.css";

const apiUrl = process.env.REACT_APP_API_URL;

const CustomerInfo = ({ customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employee } = useAuth();

  useEffect(() => {
    if (!employee?.employee_token) {
      setLoading(false);
      return;
    }

    const fetchCustomerData = async () => {
      try {
        const token = employee.employee_token;
        const response = await customerService.getCustomerById(
          customerId,
          token
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setCustomer(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId, employee]);

  if (loading) return <div className="loading-indicator">Loading customer data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="component-box wrappers shadow-sm p-3 bg-light rounded">
      <h3 className="component-title text-primary mb-3">
        Customer Information
      </h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label font-weight-bold">Name: </span>
          <span className="info-value">{customer.customer_first_name} {customer.customer_last_name}</span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">Email: </span>
          <span className="info-value text-primary">{customer.customer_email}</span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">Phone Number: </span>
          <span className="info-value">{customer.customer_phone_number}</span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">Active: </span>
          <span className="info-value">
            {customer.active_customer_status ? <span className="text-success">YES</span> : <span className="text-secondary">NO</span>}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">Actions: </span>
          <span className="info-value">
            <Link to={`/admin/customer/edit/${customerId}`}>
              <Button variant="outline-primary"> <FaEdit /></Button>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomerVehicles = ({ customerId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial: "",
    vehicle_color: "",
    customerId: customerId,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { employee } = useAuth();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const token = employee?.employee_token;
      const response = await customerService.getCustomerVehicles(
        customerId,
        token
      );

      var data = response;
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employee?.employee_token) {
      setLoading(false);
      return;
    }
    fetchVehicles();
  }, [customerId, employee]);

  const handleAddVehicleClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = employee?.employee_token;
      const response = await vehicleService.addVehicle(
        customerId,
        newVehicle,
        token
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
      }
      const data = await response.json();
      console.log("New vehicle added:", data);
      setVehicles((prev) => [...prev, data]);
      setShowForm(false);
      setNewVehicle({
        vehicle_year: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_type: "",
        vehicle_mileage: "",
        vehicle_tag: "",
        vehicle_serial: "",
        vehicle_color: "",
        customerId: customerId,
      });
      setError(null);
      setShowConfirmation(true); // Show confirmation message
      setTimeout(() => {
        setShowConfirmation(false); // Hide confirmation after a delay
      }, 3000); // Adjust the delay as needed

      // Re-fetch the vehicle data after successful submission
      fetchVehicles();

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading-indicator">Loading vehicle data...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="component-box wrappers shadow-sm p-3 bg-light rounded">
      <h3 className="component-title text-primary mb-3">Customer Vehicles</h3>
      {showConfirmation && <Alert variant="success">Vehicle added successfully!</Alert>} {/* Confirmation message */}
      {vehicles.length > 0 ? (
        <Table striped bordered hover responsive className="data-table vehicle-table">
          <thead className="bg-secondary text-white"> {/* Added background color */}
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Color</th>
              <th>License</th>
              <th>VIN</th>
              <th>Mileage</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.vehicle_id}>
                <td>{vehicle.vehicle_make}</td>
                <td>{vehicle.vehicle_model}</td>
                <td>{vehicle.vehicle_year}</td>
                <td>{vehicle.vehicle_color}</td>
                <td>{vehicle.vehicle_tag}</td>
                <td>{vehicle.vehicle_serial}</td>
                <td>{vehicle.vehicle_mileage || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No Vehicles Found</div>
      )}

      <Button variant="outline-success" onClick={handleAddVehicleClick} className="mt-3">
        Add New Vehicle
      </Button>

      {showForm && (
        <div className="mt-3 p-3 border rounded">
          <h4 className="text-primary mb-3">Add New Vehicle</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="vehicle_year">
              <Form.Label>Vehicle Year</Form.Label>
              <Form.Control type="text" name="vehicle_year" value={newVehicle.vehicle_year} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_make">
              <Form.Label>Vehicle Make</Form.Label>
              <Form.Control type="text" name="vehicle_make" value={newVehicle.vehicle_make} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_model">
              <Form.Label>Vehicle Model</Form.Label>
              <Form.Control type="text" name="vehicle_model" value={newVehicle.vehicle_model} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_type">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control type="text" name="vehicle_type" value={newVehicle.vehicle_type} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_mileage">
              <Form.Label>Vehicle Mileage</Form.Label>
              <Form.Control type="number" name="vehicle_mileage" value={newVehicle.vehicle_mileage} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_tag">
              <Form.Label>Vehicle Tag (License)</Form.Label>
              <Form.Control type="text" name="vehicle_tag" value={newVehicle.vehicle_tag} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_serial">
              <Form.Label>Vehicle Serial (VIN)</Form.Label>
              <Form.Control type="text" name="vehicle_serial" value={newVehicle.vehicle_serial} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle_color">
              <Form.Label>Vehicle Color</Form.Label>
              <Form.Control type="text" name="vehicle_color" value={newVehicle.vehicle_color} onChange={handleInputChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">Add Vehicle</Button>
          </Form>
        </div>
      )}
    </div>
  );
};

const CustomerOrders = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employee } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log("Fetching orders for customer ID:", customerId);
      const token = employee.employee_token;

      const response = await fetch(`${apiUrl}/api/order/customer/${customerId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
      console.log(response)

      if (!response.ok) {
        const message = await response.text();
        console.error(`HTTP error! status: ${response.status} - ${message}`);
        setOrders([]);
        return;
      }
      const data = await response.json();
      console.log("Customer orders:", data);
      setOrders(data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employee?.employee_token) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [customerId, employee]);

  if (loading) return <div className="loading-indicator">Loading order data...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="component-box wrappers shadow-sm p-3 bg-light rounded">
      <h3 className="component-title text-primary mb-3">Customer Orders</h3>
      {orders.length > 0 ? (
        <div><Table striped bordered hover responsive className="data-table order-table">
        <thead className="bg-info text-white"> {/* Added background color */}
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Estimated Completion</th>
            <th>Completion Date</th>
            <th>Completed</th>
            <th>Description</th>
            <th>Services</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{new Date(order.estimated_completion_date).toLocaleString()}</td>
              <td>{order.completion_date ? new Date(order.completion_date).toLocaleString() : 'Pending'}</td>
              <td>{order.order_completed ? <span className="text-success">Yes</span> : <span className="text-secondary">No</span>}</td>
              <td className="text-break">{order.order_description}</td>
              <td>
                {order.order_services && order.order_services.length > 0 ? (
                  <ul className="services-list">
                    {order.order_services.map((service) => (
                      <li key={service.service_id}>
                        <strong>{service.service_name}:</strong> {service.service_description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No services listed'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <Link  to={''}><button type="">Create Order</button></Link>
      </div>
      </div>
      ) : (
        <div>No Orders Found</div>
      )}
    </div>
  );
};

const CustomerDashboard = () => {
  const { customerId } = useParams();

  return (
    <div className="customer-dashboard">
      <h2 className="dashboard-title text-primary mb-4">Customer Dashboard</h2>
      <div className="dashboard-section">
        <CustomerInfo customerId={customerId} />
      </div>
      <div className="dashboard-section mt-4">
        <CustomerVehicles customerId={customerId} />
      </div>
      <div className="dashboard-section mt-4">
        <CustomerOrders customerId={customerId} />
      </div>
    </div>
  );
};

export default CustomerDashboard;