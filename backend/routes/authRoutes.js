const express = require("express");
const router = express.Router();
const { registerUser , loginUser } = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", (req, res) => {
  res.json({ message: "Logout route (TODO)" });
});

module.exports = router;
