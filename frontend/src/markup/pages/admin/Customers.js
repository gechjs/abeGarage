import React from "react";

import { useAuth } from "../../../Contexts/AuthContext";

import LoginForm from '../../components/LoginForm/LoginForm';
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import CustomersList from "../../components/Admin/CustomersList/CustomersList";

function Customers() {
  
  const { isLogged, isAdmin } = useAuth();

  if (!isLogged) {
    return <LoginForm />;
  }

  if (!isAdmin) {
    return <h1>You are not authorized to access this page</h1>;
  }

  return (
    <div className="container-fluid admin-pages">
  

  
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
        <div className="input-group mt-5 ml-3 mr-3 pr-5">
    <input 
      type="text" 
      className="form-control" 
      placeholder="search for a customer using first name, last name, email address or phone number" 
    />
    <span className="input-group-text">
      <i className="bi bi-search"></i>
    </span>
  </div>
      
          <CustomersList />
        </div>
      </div>
    </div>
  );
}

export default Customers;
