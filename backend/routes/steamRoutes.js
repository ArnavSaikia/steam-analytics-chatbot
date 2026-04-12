const express = require("express");
const router = express.Router();
const {getTopPlayedGames , getTotalAccountPlaytime, getTotalGameCount, getRecentlyPlayedGames, getGamePlaytimeByName, getProfileSummary, getGameRecommendations, getFriendsCurrentActivity} = require("../controllers/steamController");
const { protect } = require("../middleware/authMiddleware");

//GET_TOP_PLAYED_GAMES
router.get("/top-games", protect, getTopPlayedGames);

//GET_TOTAL_ACCOUNT_PLAYTIME
router.get("/total-playtime", protect, getTotalAccountPlaytime);

//GET_TOTAL_GAME_COUNT
router.get("/game-count", protect, getTotalGameCount);

//GET_RECENTLY_PLAYED_GAMES
router.get("/recent-games", protect, getRecentlyPlayedGames);

//GET_GAME_PLAYTIME_BY_NAME
router.get("/game-playtime", protect, getGamePlaytimeByName);

//GET_PROFILE_SUMMARY
router.get("/profile", protect, getProfileSummary);

//GET_GAME_RECOMMENDATIONS
router.get('/recommendations', protect, getGameRecommendations)

//GET_FRIENDS_CURRENT_ACTIVITY
router.get('/friend-activity', protect, getFriendsCurrentActivity);

module.exports = router;
