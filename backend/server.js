// const express = require("express");
// const reviewRoutes = require("./Routes/reviewRoutes");
// const userRoutes = require("./Routes/userRoutes");
// const carRoutes = require("./Routes/carRoutes");
// const authorizationRoutes = require("./Routes/authorizationRoutes");
// const searchRoutes = require("./Routes/searchRoutes");
// const cors = require('cors');

// require("dotenv").config();

// const app = express();
// const { Sequelize } = require("sequelize");
// const PORT = process.env.PORT || 3000;

// const sequelize = new Sequelize(
//   "CarsCatalog",
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: "localhost",
//     dialect: "postgres",
//   }
// );

// // Настройка CORS
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   credentials: true
// }));

// app.use((req, res, next) => {
//   console.log(`${req.method} request for '${req.url}'`);
//   next();
// });

// // Увеличиваем лимит для больших изображений
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Routes
// app.use("/api/car", carRoutes);
// app.use("/api/review", reviewRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/authorization", authorizationRoutes);
// app.use("/api/search", searchRoutes);

// app.options('*', cors());

// sequelize
//   .authenticate()
//   .then(() =>
//     console.log("Connection to the database has been established successfully.")
//   )
//   .catch((err) => console.error("Unable to connect to the database:", err));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const reviewRoutes = require("./Routes/reviewRoutes");
const userRoutes = require("./Routes/userRoutes");
const carRoutes = require("./Routes/carRoutes");
const authorizationRoutes = require("./Routes/authorizationRoutes");
const searchRoutes = require("./Routes/searchRoutes");
const cors = require("cors");
const { Sequelize } = require("sequelize");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Инициализация Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || "CarsCatalog",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Импорт моделей
const Result = require("./Models/Result");

// Синхронизация моделей с базой данных (только для разработки)
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.error("Database sync error:", err));

// Настройка CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Увеличиваем лимит для больших изображений
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/car", carRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/authorization", authorizationRoutes);
app.use("/api/search", searchRoutes);

app.options("*", cors());

// Тестовый маршрут для проверки подключения
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
    timestamp: new Date().toISOString(),
  });
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Экспорт для использования в других файлах
module.exports = { sequelize };
