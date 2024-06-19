const mongoose = require("mongoose");

const SynergySchema = new mongoose.Schema({
  slug: String,
  counters: [
    {
      card_slug: String,
      dimmed: Boolean,
    },
  ],
  counter: [
    {
      card_slug: String,
      dimmed: Boolean,
    },
  ],
  synergies: [
    {
      card_slug: String,
      dimmed: Boolean,
    },
  ],
  name: String,
});
const Synergy = mongoose.model("Synergy", SynergySchema, "cards-synergy");

module.exports = Synergy;
