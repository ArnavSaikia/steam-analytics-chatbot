const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const steamRoutes = require('./routes/steamRoutes');
app.use("/queries", steamRoutes)

const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes);


app.get("/status", (req, res) => {
    res.status(200).json({ status: "OK", message: "Backend running" });
});

module.exports = app;
