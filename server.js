const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

//GET SYMBOLS
app.get("/get-symbols", async (req, res) => {
  const exchange = req.query.exchange_name?.toLowerCase();
  const scraperKey = process.env.SCRAPER_API_KEY;

  let url = "";
  if (exchange === "binance") {
    url = `https://api.scraperapi.com/?api_key=${scraperKey}&url=https://api.binance.com/api/v3/exchangeInfo`;
  } else if (exchange === "okx") {
    url = "https://www.okx.com/api/v5/public/instruments?instType=SPOT";
  } else if (exchange === "bybit") {
    url = `https://api.scraperapi.com/?api_key=${scraperKey}&url=https://api.bybit.com/v5/market/instruments-info?category=spot`;
  } else if (exchange === "deribit") {
    url = "https://www.deribit.com/api/v2/public/get_instruments?currency=BTC&kind=option";
  } else {
    return res.status(400).json({ symbols: "Exchange not supported" });
  }

  try {
    console.log(`Fetching symbols from: ${exchange}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    const symbols = extractTopSymbols(exchange, data);

    console.log(`Symbols received from ${exchange}:`, symbols.slice(0, 5));

    return res.json({ symbols: symbols.slice(0, 5).join(", ") });

  } catch (err) {
    console.error(`Failed to fetch symbols from ${exchange}.`);

    if (err.response) {
      console.error(`Response status: ${err.response.status}`);
    } else if (err.request) {
      console.error("No response received.");
    } else {
      console.error(`Unexpected error: ${err.message}`);
    }

    return res.status(500).json({ error: `Unable to fetch symbols from ${exchange}` });
  }
});
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


//GET Price
app.get("/get-price", async (req, res) => {
  const exchange = req.query.exchange_name?.toLowerCase();
  const symbol = req.query.symbol;

  let url = "";
  if (exchange === "binance") {
    url = `https://api.scraperapi.com/?api_key=${process.env.SCRAPER_API_KEY}&url=https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
  } else if (exchange === "okx") {
    url = `https://www.okx.com/api/v5/market/ticker?instId=${symbol}`;
  } else if (exchange === "bybit") {
    url = `https://api.scraperapi.com/?api_key=${process.env.SCRAPER_API_KEY}&url=https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`;

  } else if (exchange === "deribit") {
    url = `https://www.deribit.com/api/v2/public/ticker?instrument_name=${symbol}`;
  } else {
    return res.status(400).json({ error: "Unsupported exchange" });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;

        let price;
      if (exchange === "binance") {
        price = data.price;
      } else if (exchange === "okx") {
        price = data.data?.[0]?.last;
      } else if (exchange === "bybit") {
        price = data.result?.list?.[0]?.lastPrice;
      } else if (exchange === "deribit") {
        price = data.result?.last_price;
      }

    return res.json({ symbol, price });

  } catch (err) {
    console.error("Error fetching price:", err.message);
    return res.status(500).json({ error: "Unable to fetch price" });
  }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
