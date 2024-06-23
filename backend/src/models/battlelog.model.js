const mongoose = require("mongoose");

const battlelogSchema = new mongoose.Schema({
  battleId: String,
  battlelog: { type: Object, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 30 }, // Ce document sera supprimé après 3 jours
  },
});

const Battlelog = mongoose.model("Battlelog", battlelogSchema);

module.exports = Battlelog;
