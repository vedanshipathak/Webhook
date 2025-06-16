const express = require('express');
const axios = require('axios');
const app = express();

app.get("/get-symbols", async (req, res) => {
  const exchange = req.query.exchange_name?.toLowerCase();

  let url = "";
  if (exchange === "binance") {
    url = "https://api.binance.com/api/v3/exchangeInfo";
  } else if (exchange === "okx") {
    url = "https://www.okx.com/api/v5/public/instruments?instType=SPOT";
  } else if (exchange === "bybit") {
    url = "https://api.bybit.com/v5/market/instruments-info?category=spot";
  } else if (exchange === "deribit") {
    url = "https://www.deribit.com/api/v2/public/get_instruments?currency=BTC&kind=option";
  } else {
    return res.json({ symbols: "Exchange not supported" });
  }

  try {
    const response = await axios.get(url);
    const data = response.data;

    const symbols = extractTopSymbols(exchange, data);
    return res.json({ symbols: symbols.slice(0, 5).join(", ") });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from exchange" });
  }
});

function extractTopSymbols(exchange, data) {
  switch (exchange) {
    case "binance":
      return data.symbols.map(s => s.symbol);
    case "okx":
      return data.data.map(s => s.instId);
    case "bybit":
      return data.result.list.map(s => s.symbol);
    case "deribit":
      return data.result.map(s => s.instrument_name);
    default:
      return ["BTCUSDT", "ETHUSDT"];
  }
}

app.listen(3000, () => console.log("Server running on port 3000"));
