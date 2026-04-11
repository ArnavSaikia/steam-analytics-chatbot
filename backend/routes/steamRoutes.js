const express = require("express");
const router = express.Router();
const {getTopPlayedGames , getTotalAccountPlaytime, getTotalGameCount} = require("../controllers/steamController");
const { protect } = require("../middleware/authMiddleware");

//GET_TOP_PLAYED_GAMES
router.get("/top-games", protect, getTopPlayedGames);

//GET_TOTAL_ACCOUNT_PLAYTIME
router.get("/total-playtime", protect, getTotalAccountPlaytime);

//GET_TOTAL_GAME_COUNT
router.get("/game-count", protect, getTotalGameCount);

module.exports = router;
