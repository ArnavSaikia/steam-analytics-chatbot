const express = require("express");
const router = express.Router();
const {getTopPlayedGames , getTotalAccountPlaytime} = require("../controllers/steamController");
const { protect } = require("../middleware/authMiddleware");

router.get("/top-games", protect, getTopPlayedGames);

router.get("/total-playtime", protect, getTotalAccountPlaytime);

module.exports = router;
