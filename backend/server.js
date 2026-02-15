require("dotenv").config();
const mongoose = require('mongoose');
const app = require("./app");

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(3000, console.log(`Server up on ${PORT}`)))
    .catch((err) => console.log(err));