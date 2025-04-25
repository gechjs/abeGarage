const conn = require("../config/db.config");

async function getVehiclesByCustomerId(customerId) {
  try {
    const query = `
      SELECT 
        vehicle_id,
        customer_id,
        vehicle_year,
        vehicle_make,
        vehicle_model,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_serial,
        vehicle_color
      FROM customer_vehicle_info 
      WHERE customer_id = ?
    `;

    const rows = await conn.query(query, [customerId]);
   
    return rows;
  } catch (err) {
    console.error("Error fetching vehicles for customer:", err);
    throw err;
  }
}

async function createVehicle(vehicleData) {
  
  const {
    customerId,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial,
    vehicle_color,
  } = vehicleData;

  const query = `
    INSERT INTO customer_vehicle_info (
      customer_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customerId,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial,
    vehicle_color,
  ];

  try {
    const result = await conn.query(query, values);
    return { vehicle_id: result.insertId, ...vehicleData };
  } catch (err) {
    console.error("Error inserting vehicle:", err);
    throw err;
  }
}

module.exports = {
  getVehiclesByCustomerId,
  createVehicle,
};
