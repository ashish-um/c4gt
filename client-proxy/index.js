const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  //   console.log(req.body);
  console.log("recieved request");

  try {
    const response = await axios.post(
      "http://20.187.151.177:5000/search",
      req.body
    );
    console.log("Sending back response");
    // response.data?.message?.catalog?.providers
    // const data = await JSON.parse(response.data);
    // console.log(response.data.responses[0].message.catalog.providers.items);
    res.json(response.data.responses[0].message.catalog.providers[0].items);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, details: error.response?.data });
  }
});

app.listen(3001, () => console.log("Proxy server running on port 3001"));
