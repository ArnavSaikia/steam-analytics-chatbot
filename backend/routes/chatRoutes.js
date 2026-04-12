const express = require("express");
const router = express.Router();

const { chatHandler } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, chatHandler);

module.exports = router;