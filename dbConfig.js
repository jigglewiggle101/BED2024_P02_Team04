//db config
module.exports = {
    user: "poly123", // Replace with your SQL Server login username
    password: "GPA4PLS", // Replace with your SQL Server login password
    server: "localhost",
    database: "polyLibApi",
    trustServerCertificate: true,
    options: {
        port: 1433, // Default SQL Server port
        connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };
  