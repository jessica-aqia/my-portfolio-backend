const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// 優化的資料庫設定
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  // 增加穩定性設定
  connectTimeout: 15000, // 15秒連線超時
  acquireTimeout: 15000, // 15秒取得連線超時
  timeout: 15000, // 15秒查詢超時
  reconnect: true, // 自動重連
  charset: "utf8mb4", // 支援中文
};

// 帶重試機制的連線函數
const connectWithRetry = async (retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`嘗試連接資料庫... (第${i + 1}次)`);
      const connection = await mysql.createConnection(dbConfig);
      console.log("資料庫連接成功！");
      return connection;
    } catch (error) {
      console.log(`連接失敗 (第${i + 1}次):`, error.message);
      if (i === retries - 1) throw error;
      // 等待1秒後重試
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// 根路徑
app.get("/", (req, res) => {
  res.json({
    message: "Jessica的後端API正常運行！",
    timestamp: new Date().toISOString(),
    database_config: {
      host: process.env.DB_HOST || "未設定",
      user: process.env.DB_USER || "未設定",
      database: process.env.DB_NAME || "未設定",
    },
  });
});

// 測試資料庫連線
app.get("/api/test-db", async (req, res) => {
  let connection;
  try {
    connection = await connectWithRetry();

    // 測試查詢
    const [result] = await connection.execute("SELECT 1 as test");

    res.json({
      success: true,
      message: "資料庫連線測試成功！",
      result: result[0],
    });
  } catch (error) {
    console.error("資料庫測試失敗:", error);
    res.status(500).json({
      success: false,
      error: "資料庫連線失敗",
      details: error.message,
      code: error.code,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// 真實專案API（優化版）
app.get("/api/projects", async (req, res) => {
  let connection;
  try {
    // 先嘗試資料庫連線
    connection = await connectWithRetry();

    const [rows] = await connection.execute(
      "SELECT id, title, description, details, image, url, created_date FROM projects ORDER BY created_date DESC"
    );

    console.log(`成功取得 ${rows.length} 筆專案資料`);

    // 處理資料
    const projects = rows.map((row) => {
      let urlArray = [];

      // 處理URL欄位
      if (row.url && typeof row.url === "string") {
        // 如果包含HTML標籤，解析連結
        if (row.url.includes("<")) {
          const cheerio = require("cheerio");
          const $ = cheerio.load(row.url);
          const links = [];
          $("a").each((i, element) => {
            links.push({
              url: $(element).attr("href"),
              text: $(element).text(),
            });
          });
          urlArray = links;
        } else {
          // 如果是純文字，按行分割
          urlArray = row.url
            .split(/[\r\n]+/)
            .filter((line) => line.trim())
            .map((line) => ({
              url: "#",
              text: line.trim(),
            }));
        }
      }

      // 格式化日期
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
    console.error("資料庫查詢失敗，使用備用資料:", error);

    // 如果資料庫失敗，回傳備用的測試資料
    const backupProjects = [
      {
        id: 6,
        title: "動態網站",
        description: "用JQuery寫的動態網站。",
        details:
          "學會JavaScript的基本用法後，在學習用JQuery的函式庫寫的電影搜尋網站，API是外國網站的，限制每天只能使用100次，有模糊查詢跟精準查詢，缺點是因為是外國網站，搜尋只能用英文電影名。",
        image:
          "https://cdn.pixabay.com/photo/2022/12/16/16/28/drinking-cups-7660115_1280.jpg",
        url: [{ url: "#", text: "電影搜尋器" }],
        date: "2025-08-04",
        year: 2025,
      },
      {
        id: 4,
        title: "靜態網站",
        description: "第一次接觸前端網頁設計的成品。",
        details: "第一次接觸html和css做出的一頁式網站。",
        image:
          "https://cdn.pixabay.com/photo/2025/08/15/07/25/ai-generated-9776380_1280.jpg",
        url: [{ url: "#", text: "查看網站" }],
        date: "2025-07-01",
        year: 2025,
      },
      // 其他專案...
    ];

    res.json({
      projects: backupProjects,
      notice: "使用備用資料（資料庫連線問題）",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Jessica的作品集API運行在 port ${port}`);
  console.log("準備測試真實資料庫連線...");
});

module.exports = app;
