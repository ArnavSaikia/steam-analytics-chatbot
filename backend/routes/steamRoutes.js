const express = require("express");
const router = express.Router();
const steamController = require("../controllers/steamController");

router.get("/summary/:steamId", steamController.getSteamSummary);

module.exports = router;
