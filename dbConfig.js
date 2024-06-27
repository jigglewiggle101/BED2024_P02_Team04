//db config

module.exports = {
    user: "", // Replace with your SQL Server login username
    password: "", // Replace with your SQL Server login password
    server: "localhost",
    database: "bed_db", //Replace with actual db name
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };