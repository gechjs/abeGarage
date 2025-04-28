import React, { useState, useEffect } from "react";
import { Table, Button, Pagination } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from 'date-fns';
import customerService from "../../../../services/customer.service";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  
  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerService.getAllCustomers(token);
        if (!res.ok) {
          setApiError(true);
          if (res.status === 401) {
            setApiErrorMessage("Please login again");
          } else if (res.status === 403) {
            setApiErrorMessage("You are not authorized to view this page");
          } else {
            setApiErrorMessage("Please try again later");
          }
        }
        const data = await res.json();
        if (data.data.length !== 0) {
          setCustomers(data.data);
        } else {
          setApiErrorMessage("No customers found");
        }
      } catch (err) {
        setApiError(true);
        setApiErrorMessage("Failed to fetch customers");
      }
    };

    fetchCustomers();
  }, [token]);

 
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>Customers</h2>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Active</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_id}</td>
                      <td>{customer.customer_first_name}</td>
                      <td>{customer.customer_last_name}</td>
                      <td>{customer.customer_email}</td>
                      <td>{customer.customer_phone_number}</td>
                      <td>{format(new Date(customer.customer_added_date), 'MM - dd - yyyy | kk:mm')}</td>
                      <td>{customer.active_customer_status ? "Yes" : "No"}</td>
                      <td>
                        <div className="edit-delete-icons">
                          edit | delete
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No customers found</td>
                  </tr>
                )}
              </tbody>
            </Table>
            {/* Pagination Component */}
            {totalPages > 1 && (
              <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default CustomersList;
