import React from 'react'
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'
import Dashboard from '../../components/Admin/Dashboard/Dashboard'
function AdminDashboard() {
  return (
    <div>
         <div>
                <div>
              <div className="container-fluid admin-pages">
                <div className="row">
                  <div className="col-md-3 admin-left-side">
                    <AdminMenu />
                  </div>
                  <div className="col-md-9 admin-right-side p-5">
                    <Dashboard></Dashboard>
                  </div>
                </div>
              </div>
            </div>
            </div>
    </div>
  )
}

export default AdminDashboard