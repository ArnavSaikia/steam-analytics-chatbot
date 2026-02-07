const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
    res.json({ message: "User profile (TODO)" });
});

router.post("/steam-id", (req, res) => {
    res.json({ message: "Save Steam ID (TODO)" });
});

module.exports = router;
