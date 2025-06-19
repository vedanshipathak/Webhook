# 📡 OTC Trading Webhook - Price Fetcher (Bybit)

This Node.js + Express backend is designed as a **webhook service** to fetch real-time prices of crypto trading pairs (symbols) from the **Bybit exchange API**. It is intended to be used by frontend interfaces or voice bots to fetch trading data via a POST request.

---

## 🚀 Features

- 📊 Accepts a symbol via POST (`BTCUSDT`, `ETHUSDT`, etc.)
- 🌐 Fetches the latest price from Bybit’s public ticker API
- 🛠️ Easy integration with bots, UI, or automation tools
- 🔒 Environment-based config via `.env`

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Axios
- dotenv

---

## 📁 Project Structure

```
.
├── server.js           # Main Express server
├── package.json        # Project metadata & dependencies
├── package-lock.json   # Lockfile for consistency
├── .gitignore          # Ignore node_modules and .env
└── .env                # Your private config (not committed)
```

---

## ⚙️ Setup Instructions

### 1. 📥 Clone the Repo

```bash
git clone https://github.com/vedanshipathak/OTC-Trading-Bot.git
cd OTC-Trading-Bot
```

### 2. 📦 Install Dependencies

```bash
npm install
```

### 3. 📄 Create `.env` File

Create a `.env` file in the root with the following content:

```env
BYBIT_API_URL=https://api.bybit.com/v2/public/tickers
PORT=3000
```

---

## ▶️ Run the Server

```bash
node server.js
```

The server will start on: `http://localhost:3000`

---

## 🔬 Testing via Postman

### 🧪 Endpoint

```
POST http://localhost:3000/get-price
```

### 📋 Headers

```
Content-Type: application/json
```

### 📦 Body (raw JSON)

```json
{
  "symbol": "BTCUSDT"
}
```

### ✅ Sample Success Response

```json
{
  "symbol": "BTCUSDT",
  "price": "65321.15"
}
```

### ❌ Sample Error Response (Invalid Symbol)

```json
{
  "error": "Symbol not found"
}
```

---

## ✅ Sample Postman Test Configuration

- Method: `POST`
- URL: `http://localhost:3000/get-price`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "symbol": "BTCUSDT"
}
```

You can test with other valid symbols like `ETHUSDT`, `SOLUSDT`, etc.

---
