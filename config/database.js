const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "your_username",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "selfpalette_projects",
  port: process.env.DB_PORT || 3306,
};

module.exports = dbConfig;
