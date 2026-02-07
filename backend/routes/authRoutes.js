const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ message: "Register route (TODO)" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login route (TODO)" });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout route (TODO)" });
});

module.exports = router;
