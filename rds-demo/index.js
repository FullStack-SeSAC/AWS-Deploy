const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const PORT = 8000;
const userModel = require("./models/User");
require("dotenv").config();

// Sequelize 연결 설정
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// 모델 초기화
const User = userModel(sequelize);

// 미들웨어 설정
app.use(express.json());
app.get("/", (req, res) => {
  res.send("안녕하세요!");
});

app.post("/api/user", async (req, res) => {
  try {
    console.log("req.body =>", req.body);
    const { username, email } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required." });
    }

    const user = await User.create({ username, email });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버에러" });
  }
});

sequelize.sync({ force: false }).then(() => {
  console.log("테이블 생성 완료!");

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
