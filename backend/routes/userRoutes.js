const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { linkSteam , returnProfile} = require("../controllers/userController");

router.post("/steam", protect, linkSteam);

router.get("/profile", protect, returnProfile)

module.exports = router;