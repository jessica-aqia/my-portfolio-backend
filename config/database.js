const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root", // 改成 root 比較常見
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "selfpalette_projects",
  port: process.env.DB_PORT || 3306,
  // 加入這些選項提高連線穩定性
  connectTimeout: 30000,
  acquireTimeout: 30000,
  timeout: 30000,
};

// 加入除錯資訊（但不要暴露密碼）
console.log("資料庫設定載入:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
});

module.exports = dbConfig;
