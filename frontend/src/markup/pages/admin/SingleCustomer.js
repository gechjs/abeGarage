import React from "react";
import { useParams } from "react-router-dom";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import { useAuth } from "../../../Contexts/AuthContext";
import CustomerDashboard from "../../components/Admin/CustomerDashboard/CustomerDashboard";

function SingleCustomer() {
  const { customerId } = useParams(); 

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side p-5">
          <CustomerDashboard customerId={customerId} />
        </div>
      </div>
    </div>
  );
}

export default SingleCustomer;
