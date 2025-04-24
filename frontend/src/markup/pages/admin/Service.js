import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import Title from "../../components/Admin/title/Title";
import { useAuth } from "../../../Contexts/AuthContext";
import serviceService from "../../../services/service.service";

function Service() {
  const { employee } = useAuth();
  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceDescription: ""
  });

  const [message, setMessage] = useState("");
  const [services, setServices] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchServices = async (token) => {
    try {
      const response = await serviceService.getAllServices(token);
      console.log(response)
      const data = await response.json();
      if (response.ok) {
        console.log(data.data)
        setServices(data.data || []);
      } else {
        setMessage(`Failed to fetch services: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while fetching services.");
    }
  };

  useEffect(() => {
   console.log("service", services)
    if (employee && employee.employee_token) {
      fetchServices(employee.employee_token);
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee?.employee_token) {
      setMessage("User is not authorized to add services.");
      return;
    }

    const response = await serviceService.createService(
      {
        service_name: formData.serviceTitle,
        description: formData.serviceDescription,
      },
      employee.employee_token
    );

    const data = await response.json();

    if (response.ok) {
      setMessage("✅ Service added successfully!");
      setFormData({ serviceTitle: "", serviceDescription: "" });
      fetchServices(employee.employee_token); 
    } else {
      setMessage(`Failed to add service: ${data?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side p-5">
          <div className="p-4">
            <Title
              title="Services We Provide"
              description="Bring to the table win-win survival strategies..."
            />
            <div>
              {services.length >0? services.map((service, index) => (
                <div key={index} className="card mb-3 p-3">
                  <h2 className="font-weight-bold">{service.service_name}</h2>
                  <h5 className="text-muted">{service.service_description}</h5>
                </div>
              )): ""}
            </div>
          </div>

          <div className="p-4">
            <Title title="Add a New Service" />
            {message && (
              <div
                className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}
              >
                {message}
              </div>
            )}
            <div className="service-form-container mt-3">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    name="serviceTitle"
                    placeholder="Enter service name"
                    className="form-control p-4"
                    value={formData.serviceTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <textarea
                    name="serviceDescription"
                    rows="5"
                    placeholder="Enter service description"
                    className="form-control"
                    value={formData.serviceDescription}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="submit"
                    value="Add Service"
                    className="btn btn-danger"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Service;
