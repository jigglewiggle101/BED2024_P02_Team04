//db config
module.exports = {
  user: "Apr_User", // Replace with your SQL Server login username
  password: "Scrum@you", // Replace with your SQL Server login password
  server: "localhost",
  database: "bed_db",
  trustServerCertificate: true,
  options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};