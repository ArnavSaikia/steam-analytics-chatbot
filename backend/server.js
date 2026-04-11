require("dotenv").config();
const connectDB = require("./utils/connectDB");
const app = require("./app");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server up on ${PORT}`);
    });
});