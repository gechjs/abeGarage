import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Pagination, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from 'date-fns';
import customerService from "../../../../services/customer.service";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaEye } from 'react-icons/fa';
import { debounce } from 'lodash';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    setApiErrorMessage(null);
    try {
      const res = await customerService.getAllCustomers(token);
      console.log("API Response:", res); // Debugging log
      if (!res.ok) {
        setApiError(true);
        setApiErrorMessage(
          res.status === 401 ? "Please login again" :
          res.status === 403 ? "You are not authorized to view this page" :
          `An unexpected error occurred. Status: ${res.status}`
        );
        console.error("API Error:", res.status, await res.text()); // Log detailed error
        return;
      }
      const data = await res.json();
      console.log("API Data:", data); // Debugging log
      if (data && data.data) {
        setCustomers(data.data);
      } else {
        setApiErrorMessage("No customers found");
        console.warn("No customers found in API response"); // Debugging log
      }
    } catch (err) {
      setApiError(true);
      setApiErrorMessage("Failed to fetch customers");
      console.error("Fetch Error:", err); // Log the error
    } finally {
      setLoading(false);
      console.log("Loading set to false"); // Debugging log
    }
  }, [token]);

  useEffect(() => {
    console.log("useEffect triggered"); // Debugging log
    fetchCustomers();
  }, [fetchCustomers]);

  const debouncedFetchCustomers = useCallback(
    debounce(() => {
      console.log("Debounced fetchCustomers called with search term:", searchTerm); // Debugging log
      fetchCustomers(); // Adjust this if you want client-side filtering
    }, 300),
    [fetchCustomers, searchTerm]
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedFetchCustomers();
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewProfile = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary" />
        <div className="mt-2">Loading customers...</div>
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
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-primary">Customers List</h2>
        </div>
        <Form.Control
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-auto pl-5 pr-5 mb-4"
          style={{ width: '800px', marginBottom: '40px' }}
        />

        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Added Date</th>
              <th>Status</th>
              <th className="text-center">View Profile</th>
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.customer_first_name}</td>
                  <td>{customer.customer_last_name}</td>
                  <td className="text-primary">{customer.customer_email}</td>
                  <td>{customer.customer_phone_number}</td>
                  <td className="text-muted">
                    {format(new Date(customer.customer_added_date), 'MM-dd-yyyy | HH:mm')}
                  </td>
                  <td>
                    {customer.active_customer_status ? (
                      <Badge bg="success" pill>Active</Badge>
                    ) : (
                      <Badge bg="secondary" pill>Inactive</Badge>
                    )}
                  </td>
                  <td className="text-center">
                    <Link to={`${customer.customer_id}`}>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="d-flex align-items-center justify-content-center gap-1 mx-auto"
                     
                    >
                      <FaEye />
                    </Button></Link>
                  </td>
                  <td className="text-center">
                    <Link to={`/admin/customer/edit/${customer.customer_id}`}>
                      <Button variant="outline-primary" size="sm" className="d-flex align-items-center justify-content-center gap-1 mx-auto">
                        <FaEdit />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  <Alert variant="info">No customers available</Alert>
                </td>
              </tr>
            )}
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
      </div>
    </section>
  );
};

export default CustomersList;