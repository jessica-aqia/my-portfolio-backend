require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dbConfig = require("./config/database"); // 匯入資料庫設定
const cheerio = require("cheerio");
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
// 根路徑
app.get("/", (req, res) => {
  res.json({
    message: "後端API正常運行！",
    database: "selfpalette_projects",
    table: "projects",
  });
});
// GET - 讀取所有專案 (修正版本)
app.get("/api/projects", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, title, description, details, image, url, created_date FROM projects ORDER BY created_date DESC"
    ); // 處理不同格式的url欄位
    const projects = rows.map((row) => {
      let urlArray = []; // 在map函數中
      if (row.url && row.url.includes("<")) {
        const $ = cheerio.load(row.url);
        const links = [];
        $("a").each((i, element) => {
          links.push({
            url: $(element).attr("href"),
            text: $(element).text(),
          });
        });
        urlArray = links;
      } //格式化日期
      let formattedDate = null;
      if (row.created_date) {
        if (typeof row.created_date === "string") {
          // 如果是字串，直接切掉T後面的部分
          formattedDate = row.created_date.split("T")[0];
        } else {
          // 如果是Date物件，轉成ISO字串再切
          formattedDate = row.created_date.toISOString().split("T")[0];
        }
      }
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        details: row.details,
        image: row.image,
        url: urlArray,
        date: formattedDate,
        year: row.created_date
          ? new Date(row.created_date).getFullYear()
          : new Date().getFullYear(),
      };
    });
    res.json(projects);
  } catch (error) {
    console.error("讀取專案失敗:", error);
    res.status(500).json({
      error: "讀取專案失敗",
      details: error.message,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});
//啟動伺服器
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`後端API運行在 http://localhost:${port}`);
  console.log(`環境: ${process.env.NODE_ENV || "development"}`);
  console.log("資料庫: selfpalette_projects");
  console.log("資料表: projects");
});
