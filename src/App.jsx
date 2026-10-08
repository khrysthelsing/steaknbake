import { useState, useEffect } from "react";
import "./App.css";
import logo from "./steaknbakelogo.jpg";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const API = import.meta.env.VITE_API_URL;

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true",
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [page, setPage] = useState("order");
  const [orders, setOrders] = useState([]);

  const [stocks, setStocks] = useState([]);
  const [stockEditId, setStockEditId] = useState(null);
  const [stockChange, setStockChange] = useState("");

  const [name, setName] = useState("");
  const [meal, setMeal] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [mealFilter, setMealFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const [salesMonth, setSalesMonth] = useState("");

  const filteredOrders = orders
    .filter(
      (order) =>
        order.name.toLowerCase().includes(search.toLowerCase()) &&
        (!mealFilter || order.meal === mealFilter) &&
        (!monthFilter || order.date.startsWith(monthFilter)),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const historyTotal = filteredOrders.reduce(
    (sum, order) => sum + Number(order.amount),
    0,
  );

  const salesOrders = orders.filter(
    (order) => !salesMonth || order.date.startsWith(salesMonth),
  );

  const totalOrders = salesOrders.reduce(
    (sum, order) => sum + Number(order.amount),
    0,
  );
  const totalPesos = totalOrders * 329;

  const quota = 100;
  const ordersLeft = quota - totalOrders;

  const meals = ["classic", "sunny side", "garden", "carbonara"];

  const chartData = meals.map((meal) => ({
    meal,
    orders: salesOrders
      .filter((order) => order.meal === meal)
      .reduce((sum, order) => sum + Number(order.amount), 0),
  }));

  function handleLogin(event) {
    event.preventDefault();

    fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then(() => {
        setLoggedIn(true);
        localStorage.setItem("loggedIn", "true");
        setLoginError("");
      })
      .catch(() => {
        setLoginError("Invalid username or password");
      });
  }

  function getOrders() {
    fetch(`${API}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }

  function getStocks() {
    fetch(`${API}/stocks`)
      .then((res) => res.json())
      .then((data) => setStocks(data));
  }

  useEffect(() => {
    getOrders();
    getStocks();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    alert("Done");

    fetch(editId ? `${API}/orders/${editId}` : `${API}/orders`, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.toLowerCase(),
        meal: meal.toLowerCase(),
        amount,
        date,
      }),
    }).then(() => {
      setName("");
      setMeal("");
      setAmount("");
      setDate("");
      setEditId(null);
      getOrders();
      getStocks();
    });
  }

  function editOrder(order) {
    setEditId(order.id);
    setName(order.name);
    setMeal(order.meal);
    setAmount(order.amount);
    setDate(order.date);
    setPage("order");
  }

  function cancelEdit() {
    setName("");
    setMeal("");
    setAmount("");
    setDate("");
    setEditId(null);
  }

  function deleteOrder(id) {
    if (!window.confirm("Delete this order?")) return;

    fetch(`${API}/orders/${id}`, { method: "DELETE" }).then(() => {
      getOrders();
      getStocks();
    });
  }

  function editStock(stock) {
    setStockEditId(stock.stock_id);
    setStockChange("");
  }

  function updateStock(stock) {
    fetch(`${API}/stocks/${stock.stock_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(stock.amount) + Number(stockChange),
      }),
    }).then(() => {
      setStockEditId(null);
      setStockChange("");
      getStocks();
    });
  }

  if (!loggedIn) {
    return (
      <main>
        <div className="container1">
          <h1>Login</h1>

          <form className="user-form" onSubmit={handleLogin}>
            <input
              className="user-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              className="user-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="add-button" type="submit">
              Login
            </button>

            {loginError && <p>{loginError}</p>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main>
      <nav className="topbar">
        <div className="brand">
          <img src={logo} alt="Steak N' Bake logo" className="logo" />
          <h2>Steak N' Bake</h2>
        </div>

        <div className="nav-buttons">
          <button onClick={() => setPage("order")}>Order Form</button>
          <button onClick={() => setPage("history")}>Order History</button>
          <button onClick={() => setPage("stocks")}>Stocks</button>
          <button onClick={() => setPage("sales")}>Sales</button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                setLoggedIn(false);
                localStorage.removeItem("loggedIn");
                setUsername("");
                setPassword("");
              }
            }}
          >
            Log Out
          </button>
        </div>
      </nav>

      {page === "order" && (
        <div className="container1">
          <h1>{editId ? "Edit Order" : "Order Form"}</h1>

          <form className="user-form" onSubmit={handleSubmit}>
            <input
              className="user-input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select
              className="user-input"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a meal
              </option>
              <option value="classic">Classic</option>
              <option value="sunny side">Sunny Side</option>
              <option value="garden">Garden</option>
              <option value="carbonara">Carbonara</option>
            </select>

            <input
              type="number"
              className="user-input"
              placeholder="Amount"
              max="300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <input
              type="date"
              className="user-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <button className="add-button" type="submit">
              {editId ? "Save" : "Submit"}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {page === "history" && (
        <div className="container2">
          <h1>Order History</h1>

          <div className="filters">
            <input
              className="user-input"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="user-input"
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
            >
              <option value="">All Meals</option>
              <option value="classic">Classic</option>
              <option value="sunny side">Sunny Side</option>
              <option value="garden">Garden</option>
              <option value="carbonara">Carbonara</option>
            </select>

            <input
              type="month"
              className="user-input"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Meal</th>
                <th>Amount</th>
                <th>Date</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5">No orders found</td>
                </tr>
              )}

              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.name}</td>
                  <td>{order.meal}</td>
                  <td>{order.amount}</td>
                  <td>{order.date}</td>
                  <td className="no-print">
                    <button onClick={() => editOrder(order)}>Edit</button>
                    <button onClick={() => deleteOrder(order.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="report-footer">
            <p>
              Total Orders: {historyTotal} = ₱
              {(historyTotal * 329).toLocaleString()}
            </p>

            <button className="print-button" onClick={() => window.print()}>
              Print Report
            </button>
          </div>
        </div>
      )}

      {page === "stocks" && (
        <div className="container3">
          <h1>Stocks</h1>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.stock_id}>
                  <td>{stock.name}</td>
                  <td>{stock.amount}</td>
                  <td>
                    {stockEditId === stock.stock_id ? (
                      <>
                        <input
                          type="number"
                          className="stock-input"
                          placeholder="+ / -"
                          value={stockChange}
                          onChange={(e) => setStockChange(e.target.value)}
                        />
                        <button onClick={() => updateStock(stock)}>Save</button>
                        <button
                          onClick={() => {
                            setStockEditId(null);
                            setStockChange("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => editStock(stock)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {page === "sales" && (
        <div className="container2">
          <h1>Sales</h1>

          <div className="filters">
            <input
              type="month"
              className="user-input"
              value={salesMonth}
              onChange={(e) => setSalesMonth(e.target.value)}
            />
          </div>

          <p>
            Total Orders: {totalOrders} = ₱{totalPesos.toLocaleString()}
          </p>
          <p>
            {ordersLeft > 0
              ? `Quota: ${totalOrders} / ${quota} (${ordersLeft} orders left)`
              : `You have met the quota! (${totalOrders} / ${quota})`}
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="meal" stroke="#e9dfcb" />
              <YAxis stroke="#e9dfcb" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#2a2522",
                  border: "1px solid #433b36",
                }}
              />
              <Bar dataKey="orders" fill="#a83f35" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}

export default App;
