const express = require('express');
const router = express.Router();

const onSearchController = require('../controllers/searchController');

router.post('/', (req, res) => {
    const payload = req.body;
    const action = payload.context?.action;

    console.log(`Received action: ${action}`);

    // Acknowledge the request immediately
    res.status(200).json({ message: { ack: { status: 'ACK' } } });

    switch (action) {
        case 'search':
            onSearchController.handleSearch(payload.context);
            break;
        default:
            console.log(`No handler for action: ${action}`);
    }
});

module.exports = router;