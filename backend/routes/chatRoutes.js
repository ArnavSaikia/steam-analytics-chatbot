const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { message } = req.body;

    res.json({
        userMessage: message,
        intent: "PLACEHOLDER_INTENT",
        response: "Chatbot logic will be added later"
    });
});

module.exports = router;
