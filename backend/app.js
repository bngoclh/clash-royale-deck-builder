const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mostuseddeckroute = require("./src/routes/most.used.deck.route");
const battlelog = require("./src/routes/battlelog.route");
const favoritecards = require("./src/routes/synergie.cards.route")
const connectDB = require("./src/config/db");
const cors = require("cors"); // Add this line

dotenv.config();

const app = express();
app.use(cors()); // And add this line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB();

app.use("/api/deck", mostuseddeckroute);
app.use("/api/player", battlelog);
app.use("/api/synergie", favoritecards);


module.exports = app;
