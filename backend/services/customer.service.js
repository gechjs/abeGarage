const conn = require("../config/db.config");
const bcrypt = require('bcrypt');

async function checkIfCustomerExists(email) {
  try {
    const query = "SELECT * FROM customer_identifier WHERE customer_email = ?";
    const rows = await conn.query(query, [email]);
    return rows.length > 0;
  } catch (err) {
    console.error("Error checking customer existence:", err);
    throw err;
  }
}

async function createCustomer(customer) {
  let createdCustomer = {};
  try {
    const customerExists = await checkIfCustomerExists(customer.customer_email);
    if (customerExists) {
      throw new Error("Customer with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(customer.customer_password, salt);

    const query1 = "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
    const result = await conn.query(query1, [
      customer.customer_email,
      customer.customer_phone,
      hashedPassword
    ]);

    if (result.affectedRows !== 1) {
      throw new Error("Failed to create customer identifier");
    }

    const customer_id = result.insertId;

    const query2 = `
      INSERT INTO customer_info (
        customer_id, 
        customer_first_name, 
        customer_last_name, 
        active_customer_status
      ) VALUES (?, ?, ?, ?)
    `;
    await conn.query(query2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status ? 1 : 0
    ]);

    createdCustomer = { customer_id, customer_email: customer.customer_email };

  } catch (err) {
    console.error("Error creating customer:", err);
    throw err;
  }

  return createdCustomer;
}

async function getAllCustomers(limit = 10) {
  try {
    const query = `
      SELECT * FROM customer_identifier 
      INNER JOIN customer_info 
      ON customer_identifier.customer_id = customer_info.customer_id 
      ORDER BY customer_identifier.customer_id DESC 
      LIMIT ?
    `;
    const rows = await conn.query(query, [limit]);
    return rows;
  } catch (err) {
    console.log("Error fetching customers:", err);
    throw err;
  }
}

async function getCustomerById(customerId) {
  try {
    const query = `
      SELECT * FROM customer_identifier 
      INNER JOIN customer_info 
      ON customer_identifier.customer_id = customer_info.customer_id
      WHERE customer_identifier.customer_id = ?
    `;
    const rows = await conn.query(query, [customerId]);

    if (rows.length === 0) {
      throw new Error("Customer not found");
    }

    return rows[0];
  } catch (err) {
    console.error("Error fetching customer data:", err);
    throw err;
  }
}
async function searchCustomers(query) {
  try {
    const sqlQuery = `
      SELECT * FROM customer_identifier
      INNER JOIN customer_info
      ON customer_identifier.customer_id = customer_info.customer_id
      WHERE customer_identifier.customer_email LIKE ? 
      OR customer_identifier.customer_phone_number LIKE ?
      OR customer_info.customer_first_name LIKE ?
      OR customer_info.customer_last_name LIKE ?
    `;
    
    const rows = await conn.query(sqlQuery, [
      `%${query}%`, 
      `%${query}%`, 
      `%${query}%`, 
      `%${query}%`
    ]);
    console.log(rows)
    return rows;
  } catch (err) {
    console.error("Error searching customers:", err);
    throw err;
  }
}


module.exports = {
  searchCustomers,
  checkIfCustomerExists,
  createCustomer,
  getAllCustomers,
  getCustomerById
};
