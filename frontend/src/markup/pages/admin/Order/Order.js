import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../Contexts/AuthContext";
import AdminMenu from "../../../components/Admin/AdminMenu/AdminMenu";
import Title from "../../../components/Admin/title/Title";
import customerService from "../../../../services/customer.service";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    order_description: '',
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
            toast.info("No customers found in the system");
          }
        } catch (err) {
          setApiError(true);
          setApiErrorMessage("Failed to fetch customers");
          toast.error("Failed to fetch customers");
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
        toast.error("Search operation failed");
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

        if (Array.isArray(data) && data.length > 0) {
          setNewOrder(prev => ({ ...prev, vehicle_id: data[0].vehicle_id }));
        } else {
          toast.info("This customer has no vehicles registered");
        }
      } catch (err) {
        setApiError(true);
        setApiErrorMessage("Failed to load vehicles");
        toast.error("Failed to load customer vehicles");
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
          if (!data.data || data.data.length === 0) {
            toast.info("No services available in the system");
          }
        } catch (err) {
          setApiError(true);
          setApiErrorMessage("Failed to load services");
          toast.error("Failed to load services");
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
      toast.warn("Please select customer, vehicle, and at least one service");
      return;
    }

    if (token) {
      try {
        setIsLoading(true);

        const payload = {
          employee_id: employee?.employee_id,
          customer_id: selectedCustomer.customer_id,
          vehicle_id: newOrder.vehicle_id,
          order_description: newOrder.order_description,
          estimated_completion_date: newOrder.estimated_completion_date,
          completion_date: null,
          order_completed: 0,
          price: newOrder.price,
          order_services: newOrder.service_ids.map(id => ({ service_id: id }))
        };

        const res = await customerService.createOrder(payload, token);
        if (!res.ok) throw new Error("Order creation failed");
        await res.json();

        toast.success('Order created successfully!');
        setSelectedCustomer(null);
        setCustomerVehicles([]);
        setNewOrder({
          vehicle_id: '',
          service_ids: [],
          order_description: '',
          estimated_completion_date: '',
          price: ''
        });
        setApiError(false);
        setApiErrorMessage(null);
      } catch (err) {
        setApiError(true);
        setApiErrorMessage(err.message || "Failed to create order");
        toast.error(err.message || "Failed to create order");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const safeServices = Array.isArray(services) ? services : [];
  const safeVehicles = Array.isArray(customerVehicles) ? customerVehicles : [];

  return (
    <div className="container-fluid admin-pages">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <div className="p-4 order-container">
            <Title title="Create a New Order" />

            {apiError && (
              <div className="alert alert-danger alert-dismissible fade show">
                {apiErrorMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setApiError(false);
                    setApiErrorMessage(null);
                  }}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {isLoading && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Processing your request...</p>
              </div>
            )}

            <div className="card search-card mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <input
                      className="form-control form-control-lg"
                      placeholder="🔍 Search customer by name, phone, or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Link to={"/admin/add-customer"} className="btn btn-primary btn-lg w-100">
                      <i className="bi bi-plus-circle me-2"></i>Add Customer
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {filteredCustomers.length > 0 && (
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Matching Customers</h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.customer_id}
                          onClick={() => !isLoading && handleCustomerSelect(customer)}
                          className={`${selectedCustomer?.customer_id === customer.customer_id ? 'table-active' : ''} cursor-pointer`}
                        >
                          <td>
                            <strong>{customer.customer_first_name} {customer.customer_last_name}</strong>
                          </td>
                          <td>{customer.customer_email}</td>
                          <td>{customer.customer_phone_number}</td>
                          <td>
                            <span className={`badge ${customer.active_customer_status ? 'bg-success' : 'bg-secondary'}`}>
                              {customer.active_customer_status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedCustomer && !isLoading && (
              <div className="card order-form-card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0 create-order-header">
                    Create Order for {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmitOrder}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label mr-2">   Select Vehicle:   </label>
                        <select
                          className="form-select form-select-lg"
                          value={newOrder.vehicle_id}
                          onChange={(e) => setNewOrder(prev => ({ ...prev, vehicle_id: e.target.value }))}
                          required
                          disabled={isLoading || safeVehicles.length === 0}
                        >
                          <option value="">{safeVehicles.length === 0 ? 'No vehicles available' : 'Select a vehicle'}</option>
                          {safeVehicles.map(vehicle => (
                            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                              {vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model} ({vehicle.vehicle_tag})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Estimated Completion</label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-lg"
                          value={newOrder.estimated_completion_date}
                          onChange={(e) => setNewOrder(prev => ({ ...prev, estimated_completion_date: e.target.value }))}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Select Services</label>
                      {safeServices.length === 0 ? (
                        <div className="alert alert-warning">
                          No services available. Please add services first.
                        </div>
                      ) : (
                        <div className="row">
                          {safeServices.map(service => (
                            <div key={service.service_id} className="col-md-4 mb-2">
                              <div className="form-check card service-card">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`service-${service.service_id}`}
                                  checked={newOrder.service_ids.includes(service.service_id)}
                                  onChange={() => !isLoading && handleServiceToggle(service.service_id)}
                                  disabled={isLoading}
                                />
                                <label className="form-check-label w-100 p-2" htmlFor={`service-${service.service_id}`}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span>{service.service_name}</span>
                                   
                                  </div>
                                 
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Order Description</label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="3"
                        value={newOrder.order_description}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, order_description: e.target.value }))}
                        disabled={isLoading}
                        placeholder="Describe the work to be done..."
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Total Price ($)</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            value={newOrder.price}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, price: e.target.value }))}
                            disabled={isLoading}
                            min="0"
                            step="0.01"
                            required
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-3 btn-lg"
                        onClick={() => setSelectedCustomer(null)}
                        disabled={isLoading}
                      >
                        <i className="bi bi-arrow-left me-2"></i>Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        disabled={isLoading || safeVehicles.length === 0 || safeServices.length === 0}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Order...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>Create Order
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;