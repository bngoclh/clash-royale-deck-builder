const mongoose = require("mongoose");
const cardSchema = require("./card.model").schema;

const mostUsedDeckSchema = new mongoose.Schema({
  playertag: { type: String, required: true },
  playerName: { type: String, required: true },
  cards: { type: [cardSchema], required: true },
  elixir: { type: Number, required: true },
  winRate: { type: String, required: true },
  count: { type: Number, required: true },
  date: { type: Date, default: Date.now },

  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 86000 }  // Ce document sera supprimé après 3 jours
},
});

module.exports = mongoose.model("MostUsedDeck", mostUsedDeckSchema);


