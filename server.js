const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();

// 中間件設定
app.use(
  cors({
    origin: "https://intro.selfpalette.idv.tw/",
    credentials: true,
  })
);

app.use(express.json());

const fakeProjects = [
  {
    id: 1,
    title: "大一系學會",
    description: "剛進系學會作為組員做的學術週活動。",
    url: '<a href="https://www.canva.com/design/DAE6YTIvdV0/BofoPUjOhkuZTpv2tJnKFg/view?utm_content=DAE6YTIvdV0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3fe554eff1">攜旺咖啡</a><a href="https://www.canva.com/design/DAE6u4Z8XkI/WjqEl3s5R3pANBuFkHcajA/view?utm_content=DAE6u4Z8XkI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h9607d1e5c7">不老夢想125號</a><a href="https://www.canva.com/design/DAE6vElHrHo/wRDpUMZuMHoSGISFynN0rg/view?utm_content=DAE6vElHrHo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8f1743a243">台灣幸福狗流浪中途協會</a>',
    image:
      "https://cdn.pixabay.com/photo/2020/12/21/08/36/dog-5849152_1280.jpg",
    created_date: "2022-03-13",
    details:
      "大一參加系學會美宣組，運用Canva製作學術週的海報，海報主題是流浪動物餐廳或咖啡廳，將學術組的內容刪減過後將想傳達給大眾的訊息放在上面做成海報，在學校大廳進行展示。",
  },
  {
    id: 2,
    title: "大二系學會",
    description: "系學會美宣組負責的事情。",
    url: '<a href="https://www.canva.com/design/DAFDXndoH4w/ILbmfu_VcaEHzoIjQ7x-YA/view?utm_content=DAFDXndoH4w&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb0f2bb2873">新生手冊內頁</a>',
    image:
      "https://cdn.pixabay.com/photo/2017/09/26/04/28/classroom-2787754_1280.jpg",
    created_date: "2022-06-12",
    details:
      "剛進系學會負責的第一個項目，設計新生手冊內容，以及經營社群網站，再到帶領大一一起為系學會活動進行美宣設計。",
  },
  {
    id: 3,
    title: "畢業專題發表",
    description: "經營社群媒體，與組員一起溝通進行美術設計。",
    url: '<a href="https://www.instagram.com/search__114/">ig社群連結</a><br / ><a href="https://www.facebook.com/NTCURSD113RP">fb社群連結</a><br />',
    image:
      "https://scontent.ftpe15-1.fna.fbcdn.net/v/t39.30808-6/486967885_1068115448689175_474931874985778155_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=B47kKKsUW1wQ7kNvwHM8rpX&_nc_oc=AdlsXCfvrGX8IP0iMXPyQRTS_iwhoBJKQc0doJsI1O0kQXe9D5512LKieFsPwk-7T-4&_nc_zt=23&_nc_ht=scontent.ftpe15-1.fna&_nc_gid=7T-VwAp2g9HHbbeMjCiJ5g&oh=00_AfX7g77PAlZubwH7GflttR_LB57A-i2Q_1KuvYKXJjp2kw&oe=68BA1683",
    created_date: "2024-04-10",
    details:
      "和系上同學一起溝通合作，從4月開始籌畫，組織班上同學的重要活動-畢業專題發表，從主視覺的發想到輸出海報，再到12月的活動正式進行，以及順利落幕。",
  },
  {
    id: 4,
    title: "靜態網站",
    description: "第一次接觸前端網頁設計的成品。",
    url: '<a href="http://youridol.byethost15.com/">靜態網站</a>',
    image:
      "https://cdn.pixabay.com/photo/2025/08/15/07/25/ai-generated-9776380_1280.jpg",
    created_date: "2025-07-01",
    details:
      "第一次接觸html和css做出的一頁式網站，運用基本的版面配置和樣式設計，展現個人對前端開發的初步理解。",
  },
  {
    id: 5,
    title: "wordpress架設網站",
    description: "運用wordpress的佈景主題架設簡單的購物網站。",
    url: '<a href="https://selfpalette.idv.tw/" alt="水晶網站">SweetDream</a>',
    image:
      "https://cdn.pixabay.com/photo/2018/04/17/17/28/amethyst-3328161_1280.jpg",
    created_date: "2025-06-27",
    details:
      "學會並運用wordpress進行架設購物網站，該購物網站由朋友閒時興趣製作的水晶飾品作為商品，以及和朋友進行討論，如果要幫他製作一個網站，他會想要網站上面有什麼功能，所完成的示範行網站，尚未正式進行經營。",
  },
  {
    id: 6,
    title: "動態網站",
    description: "用JQuery寫的動態網站。",
    url: '<a href="https://movieselect.selfpalette.idv.tw/" alt="JQuery網站">電影搜尋器</a>',
    image:
      "https://cdn.pixabay.com/photo/2022/12/16/16/28/drinking-cups-7660115_1280.jpg",
    created_date: "2025-08-04",
    details:
      "學會JavaScript的基本用法後，在學習用JQuery的函式庫寫的電影搜尋網站，API是外國網站的，限制每天只能使用100次，有模糊查詢跟精準查詢，缺點是因為是外國網站，搜尋只能用英文電影名。",
  },
];

// 根路徑 - API 狀態檢查
app.get("/", (req, res) => {
  res.json({
    message: "API 正常運行！",
    database: "selfpalette_projects",
    table: "projects",
    total_projects: fakeProjects.length,
    note: "所有 URL 都已更新為真實可點擊的連結格式",
  });
});

// GET - 讀取所有專案
app.get("/api/projects", async (req, res) => {
  try {
    // 模擬資料庫查詢延遲
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 處理資料格式，保持你原本的邏輯
    const projects = fakeProjects.map((row) => {
      let urlArray = [];

      // 處理 HTML 格式的 URL（現在都是真實連結）
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
      } else if (row.url) {
        // 如果是純文字URL
        urlArray = [{ url: row.url, text: "查看專案" }];
      }

      //格式化日期
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
    console.error("讀取專案失敗:", error);
    res.status(500).json({
      error: "讀取專案失敗",
      details: error.message,
    });
  }
});

// GET - 讀取單一專案
app.get("/api/projects/:id", async (req, res) => {
  try {
    // 模擬資料庫查詢延遲
    await new Promise((resolve) => setTimeout(resolve, 50));

    const { id } = req.params;
    const project = fakeProjects.find((p) => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({
        error: "專案不存在",
      });
    }

    // 處理 URL 格式
    let urlArray = [];
    if (project.url && project.url.includes("<")) {
      const $ = cheerio.load(project.url);
      $("a").each((i, element) => {
        urlArray.push({
          url: $(element).attr("href"),
          text: $(element).text(),
        });
      });
    } else if (project.url) {
      urlArray = [{ url: project.url, text: "查看專案" }];
    }

    // 格式化日期
    let formattedDate = null;
    if (project.created_date) {
      if (typeof project.created_date === "string") {
        formattedDate = project.created_date.split("T")[0];
      } else {
        formattedDate = project.created_date.toISOString().split("T")[0];
      }
    }

    res.json({
      ...project,
      url: urlArray,
      date: formattedDate,
      year: project.created_date
        ? new Date(project.created_date).getFullYear()
        : new Date().getFullYear(),
    });
  } catch (error) {
    console.error("讀取專案失敗:", error);
    res.status(500).json({
      error: "讀取專案失敗",
      details: error.message,
    });
  }
});

//啟動伺服器
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`API 運行在 port ${port}`);
  console.log(`測試網址: http://localhost:${port}`);
  console.log(`API 測試: http://localhost:${port}/api/projects`);
});

module.exports = app;
