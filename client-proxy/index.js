const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

// add dotenv to load environment variables
require("dotenv").config();

app.use(cors());
app.use(express.json());

// define target base URL from env with fallback
const TARGET_URL = process.env.TARGET_URL;

app.post("/", async (req, res) => {
  console.log("recieved request");

  try {
    const response = await axios.post(
      // use env-based URL
      `${TARGET_URL}/search`,
      req.body
    );
    console.log("Sending back response");
    res.json(response.data.responses[0].message.catalog.providers[0].items);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, details: error.response?.data });
  }
});

app.listen(3001, () => console.log("Proxy server running on port 3001"));
