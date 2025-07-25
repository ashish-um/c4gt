const express = require("express");
const router = express.Router();

const onSearchController = require("../controllers/searchController");
const onTestSearchController = require("../services/elasticSearchService");

router.post("/", (req, res) => {
  const payload = req.body;
  const action = payload.context?.action;

  console.log(`Received action: ${action}`);

  // Acknowledge the request immediately
  res.status(200).json({ message: { ack: { status: "ACK" } } });

  switch (action) {
    case "search":
      if (payload.message.intent.item)
        onSearchController.handleSearch(
          payload.context,
          payload.message.intent.item
        );
      break;
    default:
      console.log(`No handler for action: ${action}`);
  }
});

router.get("/test-search", async (req, res) => {
  response = await onTestSearchController.handleElasticSearch(req.query.query);
  res.json(response);
});

module.exports = router;
