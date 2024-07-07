const app = require('./app');

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "expensetracker",
}).promise();

const PORT = process.env.PORT || 3000;

pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release(); 
   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MySQL database:', error.message);
    console.error('Full error object:', error); 
  });
