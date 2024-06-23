const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mostuseddeckroute = require("./src/routes/most.used.deck.route");
const battlelog = require("./src/routes/battlelog.route");
const connectDB = require("./src/config/db");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB();

app.use("/api/deck", mostuseddeckroute);
app.use("/api", battlelog);

module.exports = app;
