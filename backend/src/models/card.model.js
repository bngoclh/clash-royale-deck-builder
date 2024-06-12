const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  elixirCost: { type: Number, required: true },
  rarity: { type: String, required: true },
});

module.exports = mongoose.model("Card", cardSchema);
