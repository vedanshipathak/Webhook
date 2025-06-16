const express = require('express');
const axios = require('axios');
const app = express();

// Main route for symbol fetching
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
    return res.status(400).json({ symbols: "Exchange not supported" });
  }

  try {
    console.log(`📡 Fetching from: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    const symbols = extractTopSymbols(exchange, data);

    console.log(`✅ Symbols fetched for ${exchange}:`, symbols.slice(0, 5));

    return res.json({ symbols: symbols.slice(0, 5).join(", ") });
  } catch (err) {
    console.error(`❌ Error fetching ${url}:`, err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Unexpected error:", err);
    }
    return res.status(500).json({ error: `Failed to fetch from ${exchange}` });
  }
});

// Function to extract top 5 symbols per exchange
function extractTopSymbols(exchange, data) {
  switch (exchange) {
    case "binance":
      return data.symbols.map(s => s.symbol);
    case "okx":
      return (data?.data || []).map(s => s.instId);
    case "bybit":
      return (data?.result?.list || []).map(s => s.symbol);
    case "deribit":
      return (data?.result || []).map(s => s.instrument_name);
    default:
      return ["BTCUSDT", "ETHUSDT"];
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
