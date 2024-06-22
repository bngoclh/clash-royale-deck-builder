const mongoose = require("mongoose");

const DeckSynergySchema = new mongoose.Schema({
    tagname : String,
    deck_synergy : Array
});


const DeckSynergy = mongoose.model("DeckSynergy", DeckSynergySchema,"deck-synergy");

module.exports = DeckSynergy;