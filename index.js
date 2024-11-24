const express = require("express");
const dotenv = require('dotenv');
const router = require("./src/routes/routes");
const socialRouter = require("./src/routes/social.route");
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/api", socialRouter);

const PORT = process.env.PORT || 4500
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})