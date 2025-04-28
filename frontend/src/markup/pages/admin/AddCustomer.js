import React from "react";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import AddCustomerForm from "../../components/Admin/AddCustomerForm/AddCustomerForm";
function AddCustomer() {
  return (
    <div>
      <div>
        <div className="container-fluid admin-pages">
          <div className="row">
            <div className="col-md-3 admin-left-side">
              <AdminMenu />
            </div>
            <div className="col-md-9 admin-right-side">
              <AddCustomerForm></AddCustomerForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;
