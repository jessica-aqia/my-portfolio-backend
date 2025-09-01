const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// 根路徑
app.get("/", (req, res) => {
  res.json({
    message: "Jessica的後端API正常運行！",
    timestamp: new Date().toISOString(),
    projects_count: 6,
  });
});

// 使用你真實的專案資料
app.get("/api/projects", (req, res) => {
  const projects = [
    {
      id: 1,
      title: "大一系學會",
      description: "剛進系學會作為組員做的學術週活動。",
      details:
        "大一參加系學會美宣組，運用Canva製作學術週的海報，海報主題是流浪動物餐廳或咖啡廳，將學術組的內容刪減過後將想傳達給大眾的訊息放在上面做成海報，在學校大廳進行展示。",
      image:
        "https://cdn.pixabay.com/photo/2020/12/21/08/36/dog-5849152_1280.jpg",
      url: [
        { url: "#", text: "攜旺咖啡" },
        { url: "#", text: "不老夢想125號" },
        { url: "#", text: "台灣幸福狗流浪中途協會" },
      ],
      date: "2022-03-13",
      year: 2022,
    },
    {
      id: 2,
      title: "大二系學會",
      description: "系學會美宣組負責的事情。",
      details:
        "剛進系學會負責的第一個項目，設計新生手冊內容，以及經營社群網站，再到帶領大一一起為系學會活動進行美宣設計。",
      image:
        "https://cdn.pixabay.com/photo/2017/09/26/04/28/classroom-2787754_1280.jpg",
      url: [{ url: "#", text: "新生手冊內頁" }],
      date: "2022-06-12",
      year: 2022,
    },
    {
      id: 3,
      title: "畢業專題發表",
      description: "經營社群媒體，與組員一起溝通進行美術設計。",
      details:
        "和系上同學一起溝通合作，從4月開始開會，組織班上同學的重要活動-畢業專題發表，從主視覺的發想到輸出海報，再到12月的活動正式進行，以及順利落幕。",
      image:
        "https://scontent.ftpe15-1.fna.fbcdn.net/v/t39.30808-6/486967885_1068115448689175_474931874985778155_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=B47kKKsUW1wQ7kNvwHM8rpX&_nc_oc=AdlsXCfvrGX8IP0iMXPyQRTS_iwhoBJKQc0doJsI1O0kQXe9D5512LKieFsPwk-7T-4&_nc_zt=23&_nc_ht=scontent.ftpe15-1.fna&_nc_gid=7T-VwAp2g9HHbbeMjCiJ5g&oh=00_AfX7g77PAlZubwH7GflttR_LB57A-i2Q_1KuvYKXJjp2kw&oe=68BA1683",
      url: [
        { url: "#", text: "Instagram社群" },
        { url: "#", text: "Facebook社群" },
      ],
      date: "2024-04-10",
      year: 2024,
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
    {
      id: 5,
      title: "WordPress架設網站",
      description: "運用wordpress的佈景主題架設簡單的購物網站。",
      details:
        "學會並運用wordpress進行架設購物網站，該購物網站由朋友閒時興趣製作的水晶飾品作為商品，以及和朋友進行討論，如果要幫他製作一個網站，他會想要網站上面有什麼功能，所完成的示範性網站，尚未正式進行經營。",
      image:
        "https://cdn.pixabay.com/photo/2018/04/17/17/28/amethyst-3328161_1280.jpg",
      url: [{ url: "#", text: "SweetDream網站" }],
      date: "2025-06-27",
      year: 2025,
    },
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
  ];

  res.json(projects);
});

// 健康檢查
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Jessica的作品集API運行正常",
    timestamp: new Date().toISOString(),
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Jessica的作品集API運行在 port ${port}`);
  console.log("載入了6個真實專案資料");
});

module.exports = app;
