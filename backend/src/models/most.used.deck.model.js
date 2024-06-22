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
  top8OpponentCards: {
    type: [
      {
        name: { type: String, required: true },
        totalCount: { type: Number, required: true },
        elixirCost: { type: Number, required: true },
        rarity: { type: String, required: true },
      },
    ],
    required: true,
  },
  WinningOpponents: {
    type: [
      {
        opponentName: { type: String, required: true },
        opponentDeck: [
          {
            name: { type: String, required: true },
            elixirCost: { type: Number, required: true },
            rarity: { type: String },
          },
        ],
      },
    ],
  },
});

const MostUsedDeck = mongoose.model("MostUsedDeck", mostUsedDeckSchema);

module.exports = MostUsedDeck;