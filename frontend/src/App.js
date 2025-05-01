import React from 'react';
import { Routes, Route } from "react-router";
import Home from "./markup/pages/Home";
import Login from "./markup/pages/Login";
import AddEmployee from './markup/pages/admin/AddEmployee';
import Unauthorized from './markup/pages/Unauthorized';
import About from './markup/pages/About';
import Contact from './markup/pages/Contact';
import Services from './markup/pages/Services';

import Orders from './markup/pages/admin/Orders';
import Customers from './markup/pages/admin/Customers';
import Employees from './markup/pages/admin/Employees';
 
import "./assets/template_assets/css/bootstrap.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/responsive.css";
import "./assets/template_assets/css/color.css";
import "./assets/styles/custom.css";

import Header from './markup/components/Header/Header';
import Footer from './markup/components/Footer/Footer';
import PrivateAuthRoute from './markup/components/Auth/PrivateAuthRoute';
import AddCustomer from './markup/pages/admin/AddCustomer';
import AdminDashboard from './markup/pages/admin/AdminDashboard';
import SingleCustomer from './markup/pages/admin/SingleCustomer';
import Service from './markup/pages/admin/Service';
import Order from './markup/pages/admin/Order/Order';
import EditCustomer from './markup/pages/admin/EditCustomer';
import EditEmployee from './markup/pages/admin/EditEmployee';
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="admin" element = {<AdminDashboard />}></Route>
        <Route path = "admin/services" element = {<Service />}></Route>
        <Route path="/admin/orders"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Orders />
            </PrivateAuthRoute>
          } />
        
        <Route path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          } />
        <Route path="/admin/customers/:customerId"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <SingleCustomer />
            </PrivateAuthRoute>
          } />
          <Route path="/admin/customer/edit/:id" element={<EditCustomer />} />

          <Route path="/admin/add-customer" element={<AddCustomer/>} />
          
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/employee/edit/:id" element = {<EditEmployee />}></Route>
        <Route path='/admin/order' element = {<Order />}/>
        <Route path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddEmployee />
            </PrivateAuthRoute>
          } />
        {/* 
          Customers (/admin/customers) - managers and admins
          Orders (/admin/orders) - Can be accessed by all employees
          Add employee (/admin/add-employee) - admins only 
            - Admin: 3 
            - Manager: 2 
            - Employee: 1 
        */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
