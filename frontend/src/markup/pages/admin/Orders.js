import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Contexts/AuthContext"
import customerService from "../../../services/customer.service";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
const Orders = () => {
  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const res = await customerService.getAllOrders(token);

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div>
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

              {orders.length === 0 && !isLoading && <p>No orders found.</p>}

              {orders.length > 0 && (
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Services</th>
                      <th>Notes</th>
                      <th>Est. Completion</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.order_id}>
                        <td>{index + 1}</td>
                        <td>{order.customer_name || "N/A"}</td>
                        <td>{order.vehicle_info || "N/A"}</td>
                        <td>
                          {order.services?.length > 0
                            ? order.services
                                .map((s) => s.service_name)
                                .join(", ")
                            : "None"}
                        </td>
                        <td>{order.order_description}</td>
                        <td>{order.estimated_completion_date}</td>
                        <td>{order.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
