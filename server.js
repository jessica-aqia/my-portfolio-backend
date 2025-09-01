require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dbConfig = require("./config/database"); // 保持原本的引用
const cheerio = require("cheerio");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// 根路徑 - 加入環境變數檢查
app.get("/", (req, res) => {
  res.json({
    message: "後端API正常運行！",
    database: process.env.DB_NAME || "selfpalette_projects",
    table: "projects",
    env_check: {
      DB_HOST: process.env.DB_HOST ? "已設定" : "未設定",
      DB_USER: process.env.DB_USER ? "已設定" : "未設定",
      DB_NAME: process.env.DB_NAME ? "已設定" : "未設定",
      DB_PASSWORD: process.env.DB_PASSWORD ? "已設定" : "未設定",
    },
  });
});

// GET - 讀取所有專案（加入更多除錯）
app.get("/api/projects", async (req, res) => {
  let connection;
  try {
    console.log("嘗試連接資料庫...", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
    });

    connection = await mysql.createConnection(dbConfig);
    console.log("資料庫連接成功！");

    const [rows] = await connection.execute(
      "SELECT id, title, description, details, image, url, created_date FROM projects ORDER BY created_date DESC"
    );

    console.log("查詢結果:", rows.length, "筆資料");

    // 你原本的資料處理邏輯保持不變
    const projects = rows.map((row) => {
      let urlArray = [];
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
      }

      let formattedDate = null;
      if (row.created_date) {
        if (typeof row.created_date === "string") {
          formattedDate = row.created_date.split("T")[0];
        } else {
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
    console.error("資料庫連線詳細錯誤:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
    });

    res.status(500).json({
      error: "讀取專案失敗",
      details: error.message,
      code: error.code,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`後端API運行在 port ${port}`);
  console.log(`環境: ${process.env.NODE_ENV || "development"}`);
  console.log("資料庫配置已載入");
});
