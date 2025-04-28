import React, { useState, useEffect } from "react";
import customerService from "../../../../services/customer.service";
import { useAuth } from "../../../../Contexts/AuthContext";

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
        console.log("token from frontend", token);

        const response = await customerService.getCustomerById(
          customerId,
          token
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("customer data", data);
        setCustomer(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId, employee]);

  if (loading) return <div className="loading">Loading customer data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="component-box">
      <h2>
        Customer {customer.customer_first_name} {customer.customer_last_name}
      </h2>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label font-weight-bold">Email:</span>
          <span className="info-value">{customer.customer_email}</span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">Phone Number:</span>
          <span className="info-value">{customer.customer_phone_number}</span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">Active Customer:</span>
          <span className="info-value">
            {customer.active_customer_status ? "YES" : "NO"}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label font-weight-bold">
            Edit Customer Info:
          </span>
          <span className="info-value">
            <button className="btn btn-primary">Edit</button>
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
    customerId: customerId
  });
  const { employee } = useAuth();

  useEffect(() => {
    if (!employee?.employee_token) {
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      try {
        console.log("Fetching vehicles for customer ID:", customerId);
        const token = employee?.employee_token;
        const response = await customerService.getCustomerVehicles(
          customerId,
          token
        );
       
        var data = response[0]
        console.log("data", data)
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
    console.log(newVehicle)
    try {
      const token = employee?.employee_token;
      const response = await customerService.addVehicle(
        customerId,
        newVehicle,
        token
      );
      if (!response.ok){
        console.log("reponse not ok")
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("New vehicle added:", data);
      setVehicles((prev) => [...prev, data]); 
      setShowForm(false); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading vehicle data...</div>;

  return (
    <div className="component-box">
      <h3>Customer Vehicles</h3>
      {vehicles.length > 0 ? (
        vehicles.map((vehicle) => (
          <div
            key={vehicle.vehicle_id}
            className="info-grid"
            style={{ marginBottom: "20px" }}
          >
            <div className="info-item">
              <span className="info-label">Make/Model:</span>
              <span className="info-value">
                {vehicle.vehicle_make} {vehicle.vehicle_model}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Year:</span>
              <span className="info-value">{vehicle.vehicle_year}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Color:</span>
              <span className="info-value">{vehicle.vehicle_color}</span>
            </div>
            <div className="info-item">
              <span className="info-label">License:</span>
              <span className="info-value">{vehicle.vehicle_tag}</span>
            </div>
            <div className="info-item">
              <span className="info-label">VIN:</span>
              <span className="info-value">{vehicle.vehicle_serial}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mileage:</span>
              <span className="info-value">
                {
  <p>{vehicle?.vehicle_mileage || 'N/A'}</p>
}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div>No Vehicle Found</div>
      )}
      <button type="submit">Add Vehicle</button>

      <div className="info-item">
        <span className="info-value">
          <button
            className="btn "
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              marginTop: "10px",
            }}
            onClick={handleAddVehicleClick}
          >
            Add New Vehicle
          </button>
        </span>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="vehicle-form"
          style={{ marginTop: "20px" }}
        >
          <div className="form-group">
            <input
              type="text"
              name="vehicle_year"
              value={newVehicle.vehicle_year}
              onChange={handleInputChange}
              placeholder="Vehicle Year"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="vehicle_make"
              value={newVehicle.vehicle_make}
              onChange={handleInputChange}
              placeholder="Vehicle Make"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="vehicle_model"
              value={newVehicle.vehicle_model}
              onChange={handleInputChange}
              placeholder="Vehicle Model"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="vehicle_type"
              value={newVehicle.vehicle_type}
              onChange={handleInputChange}
              placeholder="Vehicle Type"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="vehicle_mileage"
              value={newVehicle.vehicle_mileage}
              onChange={handleInputChange}
              placeholder="Vehicle Mileage"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="vehicle_tag"
              value={newVehicle.vehicle_tag}
              onChange={handleInputChange}
              placeholder="Vehicle Tag"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="vehicle_serial"
              value={newVehicle.vehicle_serial}
              onChange={handleInputChange}
              placeholder="Vehicle Serial"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="vehicle_color"
              value={newVehicle.vehicle_color}
              onChange={handleInputChange}
              placeholder="Vehicle Color"
              className="form-control"
              style={{ width: "400px", marginBottom: "10px" }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            Add Vehicle
          </button>
        </form>
      )}
    </div>
  );
};

const CustomerOrders = ({ customerId }) => {
  // Orders code...
};

const CustomerDashboard = ({ customerId }) => {
  return (
    <div className="customer-dashboard">
      <div className="customer-info">
        <h1 className="infos_comp">Info</h1>
        <CustomerInfo customerId={customerId} />
      </div>
      <div className="customer-info">
        <h1 className="infos_comp">Cars</h1>
        <CustomerVehicles customerId={customerId} />
      </div>
      <div className="customer-info">
        <h1 className="infos_comp">Orders</h1>
        <CustomerOrders customerId={customerId} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
