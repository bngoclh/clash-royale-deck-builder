const mongoose = require("mongoose");
const cardSchema = require("./Card").schema;

const mostUsedDeckSchema = new mongoose.Schema({
  playertag: { type: String, required: true },
  mostUsedDeck: [cardSchema], // Utilisation d'un tableau de schémas de cartes
  elixir: { type: Number, required: true },
  winRate: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("MostUsedDeck", mostUsedDeckSchema);
