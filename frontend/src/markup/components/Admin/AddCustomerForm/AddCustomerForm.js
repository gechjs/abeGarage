import React, { useState } from 'react';
import customerService from '../../../../services/customer.service';
import { useAuth } from "../../../../Contexts/AuthContext";

function AddCustomerForm() {
  const [customer_email, setEmail] = useState('');
  const [customer_first_name, setFirstName] = useState('');
  const [customer_last_name, setLastName] = useState('');
  const [customer_phone, setPhone] = useState('');
  const [customer_password, setPassword] = useState('');
  const [active_customer_status, setActiveStatus] = useState(1);

  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { employee } = useAuth();
  let token = employee?.employee_token || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    // Validate first name
    if (!customer_first_name) {
      setFirstNameError('First name is required');
      valid = false;
    } else {
      setFirstNameError('');
    }

    // Validate email
    if (!customer_email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(customer_email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!customer_password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (customer_password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    const customerData = {
      customer_email,
      customer_first_name,
      customer_last_name,
      customer_phone,
      customer_password,
      active_customer_status
    };

    try {
      setIsSubmitting(true);
      const response = await customerService.createCustomer(customerData, token);
      const data = await response.json();

      if (data.error) {
        setServerError(data.error);
      } else {
        setSuccess(true);
        setServerError('');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        (error.response?.data?.message) || error.message || error.toString();
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new customer</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && <div className="validation-error" role="alert">{serverError}</div>}
                      {success && <div className="success-message" role="alert">Customer added successfully!</div>}
                      <input
                        type="email"
                        name="customer_email"
                        value={customer_email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Customer email"
                      />
                      {emailError && <div className="validation-error" role="alert">{emailError}</div>}
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="Customer first name"
                      />
                      {firstNameError && <div className="validation-error" role="alert">{firstNameError}</div>}
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={customer_last_name}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Customer last name"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone"
                        value={customer_phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Customer phone (555-555-5555)"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="customer_password"
                        value={customer_password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                      {passwordError && <div className="validation-error" role="alert">{passwordError}</div>}
                    </div>
                    <div className="form-group col-md-12">
                      <label>
                        <input
                          type="checkbox"
                          checked={active_customer_status}
                          onChange={(e) => setActiveStatus(e.target.checked)}
                        />{' '}
                        Active Status
                      </label>
                    </div>
                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <span>{isSubmitting ? 'Please wait...' : 'Add customer'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddCustomerForm;
