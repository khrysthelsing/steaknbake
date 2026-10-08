import "dotenv/config";
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  ssl:
    process.env.DB_HOST === "localhost"
      ? undefined
      : { rejectUnauthorized: false },
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

app.post("/orders", (req, res) => {
  const { name, meal, amount, date } = req.body;

  const sql =
    "INSERT INTO orders (name, meal, amount, date) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, meal, amount, date], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send("Order added");
    }
  });
});

app.put("/orders/:id", (req, res) => {
  const { name, meal, amount, date } = req.body;
  const { id } = req.params;

  const sql =
    "UPDATE orders SET name = ?, meal = ?, amount = ?, date = ? WHERE id = ?";

  db.query(sql, [name, meal, amount, date, id], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send("Order updated");
    }
  });
});

app.delete("/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Error");
    res.send("Deleted");
  });
});

app.get("/stocks", (req, res) => {
  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.json(results);
    }
  });
});

app.put("/stocks/:id", (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;

  const sql = "UPDATE stocks SET amount = ? WHERE stock_id = ?";

  db.query(sql, [amount, id], (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send("Stock updated");
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      res.status(500).send("Database error");
    } else if (results.length > 0) {
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});
