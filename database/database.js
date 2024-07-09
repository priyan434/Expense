const mysql = require("mysql2");
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "expensetracker",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })
  .promise();


module.exports=pool