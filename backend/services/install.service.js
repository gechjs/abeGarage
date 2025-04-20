// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
// Import the fs module to read our sql file  
const fs = require('fs');
// Write a function to create the database tables  
async function install() {
  // Create a variable to hold the path to the sql file  
  const queryfile = __dirname + '/sql/initial-queries.sql';
  // console.log(queryfile);
  // Temporary variable, used to store all queries, the return message and the current query
  let queries = [];
  let finalMessage = {};
  let templine = '';
  // Read the sql file 
  const lines = await fs.readFileSync(queryfile, 'utf-8').split('\n');
  // Create a promise to handle the asynchronous reading of the file and storing of the queries in the variables  
  const executed = await new Promise((resolve, reject) => {
    // Iterate over all lines
    lines.forEach((line) => {
      if (line.trim().startsWith('--') || line.trim() === '') {
        // Skip if it's a comment or empty line
        return;
      }
      templine += line;
      if (line.trim().endsWith(';')) {
      
        const sqlQuery = templine.trim();
        queries.push(sqlQuery);
        templine = '';
      }
    });
    resolve("Queries are added to the list");
  });
  //Loop through the queries and execute them one by one asynchronously  
  for (let i = 0; i < queries.length; i++) {
    try {
      const result = await conn.query(queries[i]);
      console.log("Table created");
    } catch (err) {
      // console.log("Err Occurred - Table not created");
      finalMessage.message = "Not all tables are created";
    }
  }
  // Prepare the final message to return to the controller 
  if (!finalMessage.message) {
    finalMessage.message = "All tables are created";
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }
  return finalMessage;
}

module.exports = { install };