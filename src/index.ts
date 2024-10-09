const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const axios = require("axios");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan("dev"));

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
const fetchPizzasFromExternalAPI = async () => {
  try {
    const response = await axios.get(
      "https://657c2de4853beeefdb98d6e9.mockapi.io/items"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pizzas from external API:", error);
    return [];
  }
};

app.get("/api/pizzas", async (req, res) => {
  console.log("Request received for /api/pizzas");

  // Логування параметрів запиту
  console.log("Query parameters:", req.query);
  const {
    page = 1,
    category = 0,
    sort = "rating",
    order = "desc",
    search = "",
  } = req.query;

  // Перетворення page на число і перевірка, що воно не менше 1
  const pageNumber = Math.max(Number(page), 1); // Гарантуємо, що page >= 1
  const itemsPerPage = 10; // Кількість елементів на сторінку
  const offset = (pageNumber - 1) * itemsPerPage; // Обчислюємо зсув

  console.log("Page:", page, "Page Number:", pageNumber);

  console.log(`Page: ${page}, Category: ${category}, Sort: ${sort}, 
  Order: ${order}, Search: ${search}`);

  try {
    // Запит для фільтрації за категорією, пошуком і сортуванням
    let query: string = `SELECT * FROM pizzas WHERE 1=1`; // Базовий запит
    const queryParams: (number | string)[] = []; // Вказуємо типи для параметрів

    if (category !== 0) {
      query += ` AND category = ?`;
      queryParams.push(category);
    }

    if (search) {
      query += ` AND title LIKE ?`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sort} ${order} LIMIT ?, ?`;

    console.log("Query:", query);

    queryParams.push(offset, itemsPerPage);
    console.log("Query parameters for DB:", queryParams);

    db.query(query, queryParams, async (err, results) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res
          .status(500)
          .json({ message: "Error fetching pizzas from DB" });
      }

      if (results.length === 0) {
        // Якщо даних немає в БД, отримати з зовнішнього API
        const pizzas = await fetchPizzasFromExternalAPI();

        // Збереження нових піц в БД
        const insertQuery: string = `
        INSERT INTO pizzas (title, price, rating, imageUrl, category, sizes, types) 
        VALUES ?
        `;
        const pizzaData: any[][] = pizzas.map((pizza) => [
          pizza.title,
          pizza.price,
          pizza.rating,
          pizza.imageUrl,
          pizza.category,
          JSON.stringify(pizza.sizes || []),
          JSON.stringify(pizza.types || []),
        ]);

        // 1
        // db.query(insertQuery, [pizzaData], (err, res) => {
        //   if (err) {
        //     console.error("MySQL Error during insert:", err);
        //     return res
        //       .status(500)
        //       .json({ message: "Error inserting pizzas into DB" });
        //   }
        //   return res.json(pizzas);
        // 2
        db.query(insertQuery, [pizzaData], (err, result) => {
          // Змінено 'res' на 'result'
          if (err) {
            console.error("MySQL Error during insert:", err);
            return res
              .status(500)
              .json({ message: "Error inserting pizzas into DB" });
          }

          // Повертаємо введену піцу або дані, які вам потрібні
          return res.json({
            message: "Pizza inserted successfully",
            data: pizzaData,
          });
        });
      } else {
        // 1
        // Парсинг полів sizes і types перед відправкою
        // const parsedResults = results.map((pizza) => ({
        //   ...pizza,
        //   sizes: pizza.sizes ? JSON.parse(pizza.sizes) : [],
        //   types: pizza.types ? JSON.parse(pizza.types) : [],
        // }));
        // return res.json(parsedResults);
        // 2
        // const parsedResults = results.map((pizza) => {
        //   console.log("Raw pizza data before parsing:", pizza);
        //   try {
        //     return {
        //       ...pizza,
        //       sizes:
        //         typeof pizza.sizes === "string" ? JSON.parse(pizza.sizes) : [],
        //       types:
        //         typeof pizza.types === "string" ? JSON.parse(pizza.types) : [],
        //     };
        //   } catch (error) {
        //     console.error("Error parsing JSON:", error, "Pizza data:", pizza);
        //     return {
        //       ...pizza,
        //       sizes: [],
        //       types: [],
        //     };
        //   }
        // });
        const parsedResults = results.map((pizza) => {
          console.log("Raw pizza data before parsing:", pizza);
          try {
            return {
              ...pizza,
              // Перевіряємо, чи `sizes` є рядком, і лише тоді парсимо
              sizes: Array.isArray(pizza.sizes)
                ? pizza.sizes
                : JSON.parse(pizza.sizes),
              // Перевіряємо, чи `types` є рядком, і лише тоді парсимо
              types: Array.isArray(pizza.types)
                ? pizza.types
                : JSON.parse(pizza.types),
            };
          } catch (error) {
            console.error("Error parsing JSON:", error, "Pizza data:", pizza);
            return {
              ...pizza,
              sizes: [],
              types: [],
            };
          }
        });
        // Додайте цей рядок для повернення результатів на фронтенд:
        return res.json(parsedResults);
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 1 варіант
// Щоб створити бекенд на **Node.js** для вашої програми, яка буде працювати з базою даних **MySQL** і отримувати часткові дані з іншого API, ми можемо розділити задачу на наступні етапи:

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

// 2
// Що змінилося:
// Типи даних:
// Додано типи для itemsPerPage, offset, query, queryParams, та pizzaData, щоб TypeScript знав, з чим працює.
// Вказано тип (number | string)[] для queryParams, що дозволяє передавати як числа, так і рядки.
// Для pizzaData встановлено тип any[][], оскільки ми не знаємо структури об'єкта pizza.
// Пояснення помилок
// "Аргумент типа 'any' нельзя назначить параметру типа 'never'": Це означає, що TypeScript не зміг визначити типи
// аргументів у вашому масиві queryParams, що призвело до того, що він не може обробити їх.
// "Аргумент типа 'string' нельзя назначить параметру типа 'never'": Це вказує на те, що TypeScript не знає, якого
// типу дані передаються в м

// я маю  db.query(insertQuery, [pizzaData], (err, res) => {
//   if (err) {
//     console.error("MySQL Error during insert:", err);
//     return res
//       .status(500)
//       .json({ message: "Error inserting pizzas into DB" });
//   }
//   return res.json(pizzas);
// Програма ChatGPT сказала:
// ChatGPT
// У вашому коді ви намагаєтеся використати res у контексті, де він вже був використаний для обробки запиту. Це призводить до конфлікту, оскільки res всередині колбеку db.query знову визначається як параметр. Вам потрібно дати іншому імені (наприклад, result) тому, що передається у колбеку запиту до бази даних.

// Ось як можна це виправити:

// Виправлений код
//
// Копіювати код
// db.query(insertQuery, [pizzaData], (err, result) => { // Змінено 'res' на 'result'
// if (err) {
// console.error("MySQL Error during insert:", err);
// return res.status(500).json({ message: "Error inserting pizzas into DB" });
// }

// // Повертаємо введену піцу або дані, які вам потрібні
// return res.json({ message: "Pizza inserted successfully", data: pizzaData });
// });
// Основні зміни
// Зміна параметра колбеку: Я змінив другий параметр у колбеку з res на result,
//  щоб уникнути
// плутанини з об'єктом відповіді Express.

// Повернення результату: Я змінив повернення результату на
// JSON-об'єкт, який містить повідомлення про успіх і дані, які були
//  вставлені (або інші дані, які вам потрібні).

// Пояснення
// Конфлікт з іменами: Ваша оригінальна версія викликала помилку, оскільки ви н
// амагалися використовувати res як параметр в обробнику запиту до бази даних.
// Це призводить до конфлікту з об'єктом відповіді Express, що викликало помилку.

// Відповідь після вставки: Це важливо, щоб правильно обробити успішну вставку,
// повертаючи коректну відповідь на запит клієнта.
