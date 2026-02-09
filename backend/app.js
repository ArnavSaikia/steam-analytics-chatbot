const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", require("./routes/authRoutes.js"));
app.use("/user", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));


app.get("/status", (req, res) => {
    res.status(200).json({ status: "OK", message: "Backend running" });
});

module.exports = app;
