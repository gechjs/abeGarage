const conn = require('../config/db.config');

async function createService(service) {
  const { service_name, description } = service;
  const query = "INSERT INTO common_services (service_name, service_description) VALUES (?, ?)";

  try {
    const [rows] = await conn.query(query, [service_name, description]);
    if (rows.affectedRows === 0) {
      throw new Error('Failed to insert service');
    }

    return {
      service_id: rows.insertId,
      service_name,
      description,
      
    };
  } catch (error) {
    console.error(error);
    return false;
  }
}


async function getAllServices() {
  const query = "SELECT * FROM common_services ORDER BY service_id DESC";
  
  try {
    const response = await conn.query(query);
   
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  createService,
  getAllServices
};
