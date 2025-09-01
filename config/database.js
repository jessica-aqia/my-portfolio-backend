const mysql = require("mysql2/promise");
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "selfpalette_projects_user",
  password: process.env.DB_PASSWORD || ",v@WCmoSsnG=F9@p",
  database: process.env.DB_NAME || "selfpalette_projects",
};
module.exports = dbConfig;
