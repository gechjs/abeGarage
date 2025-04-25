import React, { useState } from "react";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import Title from "../../components/Admin/title/Title";
import { useAuth } from "../../../Contexts/AuthContext";

function Vehicle() {
  const { employee } = useAuth();
  const token = employee?.employee_token || "";

  const [formData, setFormData] = useState({
    customer_id: "",
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial: "",
    vehicle_color: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Vehicle added successfully!");
        setFormData({
          customer_id: "",
          vehicle_year: "",
          vehicle_make: "",
          vehicle_model: "",
          vehicle_type: "",
          vehicle_mileage: "",
          vehicle_tag: "",
          vehicle_serial: "",
          vehicle_color: ""
        });
      } else {
        setMessage(`❌ Failed to add vehicle: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error while submitting the vehicle.");
    }
  };

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side p-5">
          <Title title="Add New Vehicle" />
          {message && (
            <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="p-4">
            {Object.entries(formData).map(([key, value]) => (
              <div className="form-group mb-3" key={key}>
                <input
                  type="text"
                  name={key}
                  className="form-control p-3"
                  placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  value={value}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-danger">Add Vehicle</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Vehicle;
