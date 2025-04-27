import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../Contexts/AuthContext";
import AdminMenu from "../../../components/Admin/AdminMenu/AdminMenu";
import Title from "../../../components/Admin/title/Title";
import customerService from "../../../../services/customer.service";
import "./order.css";

function Order() {
  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerVehicles, setCustomerVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [newOrder, setNewOrder] = useState({
    vehicle_id: '',
    service_ids: [],
    notes: '',
    estimated_completion_date: '',
    price: ''
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const res = await customerService.getAllCustomers(token);
          const data = await res.json();
          if (data.data && data.data.length !== 0) {
            setCustomers(data.data);
          } else {
            setApiErrorMessage("No customers found");
          }
        } catch (err) {
          setApiError(true);
          setApiErrorMessage("Failed to fetch customers");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchCustomers();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers([]);
      return;
    }

    const timeout = setTimeout(() => {
      try {
        const results = customers.filter(customer =>
          customer.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.customer_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.customer_phone_number.includes(searchTerm)
        );
        setFilteredCustomers(results);
        setApiError(false);
        setApiErrorMessage(null);
      } catch (err) {
        setApiError(true);
        setApiErrorMessage("Search failed");
        setFilteredCustomers([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, customers]);

  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    if (token) {
      try {
        setIsLoading(true);
        const res = await customerService.getCustomerVehicles(customer.customer_id, token);
        const data = res;
        setCustomerVehicles(data || []);

        if (data && data.length > 0) {
          setNewOrder(prev => ({ ...prev, vehicle_id: data[0].vehicle_id }));
        }
      } catch (err) {
        setApiError(true);
        setApiErrorMessage("Failed to load vehicles");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const res = await customerService.getAllServices(token);
          if (!res.ok) throw new Error("Failed to fetch services");
          const data = await res.json();
          setServices(data.data || []);
        } catch (err) {
          setApiError(true);
          setApiErrorMessage("Failed to load services");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchServices();
  }, [token]);

  const handleServiceToggle = (serviceId) => {
    setNewOrder(prev => {
      const newServiceIds = prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId];
      return { ...prev, service_ids: newServiceIds };
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !newOrder.vehicle_id || newOrder.service_ids.length === 0) {
      setApiError(true);
      setApiErrorMessage("Please select a customer, vehicle, and at least one service");
      return;
    }

    if (token) {
      try {
        setIsLoading(true);
        const res = await customerService.createOrder(
          {
            customer_id: selectedCustomer.customer_id,
            vehicle_id: newOrder.vehicle_id,
            service_ids: newOrder.service_ids,
            notes: newOrder.notes,
            estimated_completion_date: newOrder.estimated_completion_date,
            price: newOrder.price
          },
          token
        );

        if (!res.ok) throw new Error("Order creation failed");

        await res.json();
        alert('Order created successfully!');

        setSelectedCustomer(null);
        setCustomerVehicles([]);
        setNewOrder({
          vehicle_id: '',
          service_ids: [],
          notes: '',
          estimated_completion_date: '',
          price: ''
        });
        setApiError(false);
        setApiErrorMessage(null);
      } catch (err) {
        setApiError(true);
        setApiErrorMessage(err.message || "Failed to create order");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <div className="p-4">
            <Title title="Create a new order" />

            {apiError && (
              <div className="alert alert-danger">
                {apiErrorMessage}
                <button
                  type="button"
                  className="btn-close float-end"
                  onClick={() => {
                    setApiError(false);
                    setApiErrorMessage(null);
                  }}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {isLoading && (
              <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="d-flex align-items-center gap-4 mb-3">
                <input
                  className="order-input form-control"
                  placeholder="Search customer by first name, last name, phone, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="btn btn-primary add-customer-btn"
                  disabled={isLoading}
                >
                  Add Customer
                </button>
              </div>

              {filteredCustomers.length > 0 && (
                <div className="customer-table-container">
                  <table className="table table-striped customer-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.customer_id}
                          onClick={() => !isLoading && handleCustomerSelect(customer)}
                          className={selectedCustomer?.customer_id === customer.customer_id ? 'table-primary' : ''}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{customer.customer_first_name} {customer.customer_last_name}</td>
                          <td>{customer.customer_email}</td>
                          <td>{customer.customer_phone_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedCustomer && !isLoading && (
              <div className="order-form-section">
                <h4>Create Order for {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}</h4>

                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-3">
                    <label className="form-label">Select Vehicle:</label>
                    <select
                      className="form-select"
                      value={newOrder.vehicle_id}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, vehicle_id: e.target.value }))}
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a vehicle</option>
                      {customerVehicles.map(vehicle => (
                        <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                          {vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model} ({vehicle.vehicle_tag})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Select Services:</label>
                    <div className="services-grid">
                      {services.map(service => (
                        <div key={service.service_id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`service-${service.service_id}`}
                            checked={newOrder.service_ids.includes(service.service_id)}
                            onChange={() => !isLoading && handleServiceToggle(service.service_id)}
                            disabled={isLoading}
                          />
                          <label className="form-check-label" htmlFor={`service-${service.service_id}`}>
                            {service.service_name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Estimated Completion Date:</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={newOrder.estimated_completion_date}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, estimated_completion_date: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes:</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newOrder.notes}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price (ETB):</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newOrder.price}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, price: e.target.value }))}
                      min="0"
                      step="0.01"
                      placeholder="Enter order price"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Order...' : 'Create Order'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
