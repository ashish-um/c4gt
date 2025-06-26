const express = require("express");
const dotenv = require("dotenv");
const becknRoutes = require("./routes/becknRoutes");
dotenv.config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Webhook is running...");
});

app.use("/", becknRoutes);

app.listen(PORT, () => {
  console.log(`Webhook server listening on http://localhost:${PORT}/`);
});
