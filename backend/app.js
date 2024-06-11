const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const deckRoutes = require("./src/routes/deckRoutes");
const connectDB = require("./src/utils/db");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB();

app.use("/api/decks", deckRoutes);

module.exports = app;
