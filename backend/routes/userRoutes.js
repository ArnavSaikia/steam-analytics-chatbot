const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { linkSteam } = require("../controllers/userController");

router.post("/steam", protect, linkSteam);

module.exports = router;