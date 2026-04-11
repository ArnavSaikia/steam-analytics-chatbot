const express = require("express");
const router = express.Router();
const {getTopPlayedGames} = require("../controllers/steamController");
const { protect } = require("../middleware/authMiddleware");

router.get("/top-games", protect, getTopPlayedGames);

module.exports = router;
