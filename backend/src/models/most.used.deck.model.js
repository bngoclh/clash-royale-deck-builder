const mongoose = require("mongoose");
const cardSchema = require("./card.model").schema;

const mostUsedDeckSchema = new mongoose.Schema({
  playertag: { type: String, required: true },
  playerName: { type: String, required: true },
  cards: { type: [cardSchema], required: true },
  elixir: { type: Number, required: true },
  winRate: { type: String, required: true },
  count: { type: Number, required: true },
  synergies: [
    {
      card: { type: String, required: true },
      synergies_list: [{ type: String, required: true }],
    },
  ],
  solo_cards: [
    {
      card_name: { type: String, required: true },
      alternatives: [{ type: String, required: true }],
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MostUsedDeck", mostUsedDeckSchema);
