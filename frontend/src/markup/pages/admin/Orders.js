import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import orderService from "../../../services/order.service";
import customerService from "../../../services/customer.service";
import employeeService from "../../../services/employee.service"; // already imported
import vehicleService from "../../../services/vehicle.service";   // NEW: import vehicle service
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import { Link } from "react-router-dom";

const Orders = () => {
  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [employees, setEmployees] = useState({});
  const [vehicles, setVehicles] = useState({}); // NEW: vehicles state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const res = await orderService.getAllOrders(token);

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data || []);
        setError(null);

        // Fetch related data
        fetchAllCustomers();
        fetchAllEmployees();
        fetchAllVehicles();
      } catch (err) {
        setError(err.message || "An error occurred");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllCustomers = async () => {
      if (!token) return;
      try {
        const res = await customerService.getAllCustomers(token);
        if (res.ok) {
          const customerData = await res.json();
          const customerMap = customerData.data.reduce((acc, customer) => {
            acc[customer.customer_id] = customer;
            return acc;
          }, {});
          setCustomers(customerMap);
        }
      } catch (err) {
        console.log("Error fetching customers:", err);
      }
    };

    const fetchAllEmployees = async () => {
      if (!token) return;
      try {
        const res = await employeeService.getAllEmployees(token);
        if (res.ok) {
          const employeeData = await res.json();
          const employeeMap = employeeData.data.reduce((acc, employee) => {
            acc[employee.employee_id] = employee;
            return acc;
          }, {});
          setEmployees(employeeMap);
        }
      } catch (err) {
        console.log("Error fetching employees:", err);
      }
    };

    const fetchAllVehicles = async () => {
      if (!token) return;
      try {
        const res = await vehicleService.getAllVehicles(token);
        if (res.ok) {
          const vehicleData = await res.json();
          console.log("vihcles data", vehicleData);
          const vehicleMap = vehicleData.data.reduce((acc, vehicle) => {
            acc[vehicle.vehicle_id] = vehicle;
            return acc;
          }, {});
          setVehicles(vehicleMap);
        }
      } catch (err) {
        console.log("Error fetching vehicles:", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <div className="container mt-4">
            <h1 className="mb-4">Orders</h1>

            {isLoading && <p>Loading orders...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!isLoading && orders.length === 0 && <p>No orders found.</p>}

            {orders.length > 0 && (
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Order Date</th>
                    <th>Received By</th>
                    <th>Status</th>
                    <th>View / Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      {console.log(vehicles)}
                      <td>{order.order_id}</td>
                      <td>
                        {customers[order.customer_id] ? (
                          <>
                            <p><strong>Name:</strong> {`${customers[order.customer_id].customer_first_name} ${customers[order.customer_id].customer_last_name}` || "N/A"}</p>
                            <p><strong>Email:</strong> {customers[order.customer_id].customer_email || "N/A"}</p>
                            <p><strong>Phone:</strong> {customers[order.customer_id].customer_phone_number || "N/A"}</p>
                          </>
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>
                        {vehicles[order.vehicle_id] ? (
                          <>
                            <p><strong>Name:</strong> {vehicles[order.vehicle_id].vehicle_make
 || "N/A"}</p>
                            <p><strong>Production Year:</strong> {vehicles[order.vehicle_id].vehicle_year || "N/A"}</p>
                            <p><strong>Serial:</strong> {vehicles[order.vehicle_id].vehicle_serial
 || "N/A"}</p>
                          </>
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>
                        {employees[order.employee_id] ? (
                          <p>{`${employees[order.employee_id].employee_first_name} ${employees[order.employee_id].employee_last_name}`|| "N/A"}</p>
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>
                        {order.order_completed === 1 ? (
                          <span className="badge bg-success">Completed</span>
                        ) : (
                          <span className="badge bg-warning text-dark">In Progress</span>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/admin/order/${order.order_hash}/edit`}
                          className="btn btn-sm btn-primary"
                        >
                          View/Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
