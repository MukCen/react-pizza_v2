"use strict";
// 1 варіант
// Щоб створити бекенд на **Node.js** для вашої програми, яка буде працювати з базою даних **MySQL** і отримувати часткові дані з іншого API, ми можемо розділити задачу на наступні етапи:
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 1. **Node.js + Express для створення API**.
// 2. **MySQL** для зберігання і часткового заповнення даних.
// 3. **Запит до зовнішнього API** для отримання додаткових даних про піци.
// 4. **Робота з базою даних** через MySQL (або Sequelize для ORM).
// 5. **Інтеграція з фронтендом** (React).
// ### Крок 1: Налаштування Node.js сервера
// #### 1.1. Встановлення Node.js і створення проекту
// Створіть новий проект Node.js:
// mkdir pizza-backend
// cd pizza-backend
// npm init -y
// ```
// Додайте необхідні залежності:
// npm install express mysql2 axios cors body-parser dotenv
// ```
// - **express** — для створення API.
// - **mysql2** — для роботи з MySQL.
// - **axios** — для запитів до зовнішніх API.
// - **cors** — для обробки CORS запитів від клієнта.
// - **dotenv** — для зберігання конфіденційної інформації (наприклад, підключення до БД).
// #### 1.2. Створення простого сервера на Express
// У кореневій папці створіть файл    index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
// Підключення до MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL!");
});
// Запит до зовнішнього API для отримання даних піц
const fetchPizzasFromExternalAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get("https://657c2de4853beeefdb98d6e9.mockapi.io/items");
        return response.data;
    }
    catch (error) {
        console.error("Error fetching pizzas from external API:", error);
        return [];
    }
});
app.get("/api/pizzas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, category = 0, sort = "rating", order = "desc" } = req.query;
    try {
        const query = "SELECT * FROM pizzas";
        db.query(query, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("MySQL Error:", err);
                return res
                    .status(500)
                    .json({ message: "Error fetching pizzas from DB" });
            }
            if (results.length === 0) {
                const pizzas = yield fetchPizzasFromExternalAPI();
                const insertQuery = `
          INSERT INTO pizzas (title, price, rating, imageUrl, category, sizes, types) 
          VALUES ?
        `;
                const pizzaData = pizzas.map((pizza) => [
                    pizza.title,
                    pizza.price,
                    pizza.rating,
                    pizza.imageUrl,
                    pizza.category,
                    JSON.stringify(pizza.sizes || []),
                    JSON.stringify(pizza.types || []),
                ]);
                db.query(insertQuery, [pizzaData], (err, result) => {
                    if (err) {
                        console.error("MySQL Error during insert:", err);
                        return res
                            .status(500)
                            .json({ message: "Error inserting pizzas into DB" });
                    }
                    return res.json(pizzas);
                });
            }
            else {
                const parsedResults = results.map((pizza) => (Object.assign(Object.assign({}, pizza), { sizes: typeof pizza.sizes === "string" && pizza.sizes[0] === "["
                        ? JSON.parse(pizza.sizes) // Якщо це JSON, парсимо
                        : Array.isArray(pizza.sizes) // Якщо це масив, повертаємо як є
                            ? pizza.sizes
                            : typeof pizza.sizes === "string" // Якщо це рядок
                                ? pizza.sizes.split(",").map(Number) // Конвертуємо в масив чисел
                                : [], types: typeof pizza.types === "string" && pizza.types[0] === "["
                        ? JSON.parse(pizza.types) // Якщо це JSON, парсимо
                        : Array.isArray(pizza.types) // Якщо це масив, повертаємо як є
                            ? pizza.types
                            : typeof pizza.types === "string" // Якщо це рядок
                                ? pizza.types.split(",").map(Number) // Конвертуємо в масив чисел
                                : [] })));
                return res.json(parsedResults);
            }
        }));
    }
    catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// Після налаштування tsconfig.json, ви можете скомпілювати ваш проект за допомогою:
// bash
// Копіювати код
// npm run build
// У цьому коді:
// JSON.stringify: Використовуйте JSON.stringify для полів sizes і types,
// щоб перетворити масиви на рядки JSON під час вставки в базу даних.
// Управління null: Додано || [] для поля sizes і types, щоб при відсутності
// даних використовувався порожній масив замість null.
// Ці зміни повинні усунути помилку при вставці. Спробуйте запустити код ще
// раз після внесення цих змін.
// Використовується JSON.stringify для перетворення масивів sizes та types у JSON-формат, що дозволяє вам зберігати їх у базі даних.
// Вам не потрібно включати поле id у ваш запит на вставку, оскільки MySQL автоматично генерує його.
// Спробуйте цей код, і він повинен вирішити вашу проблему.
