// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { 
    type: String
    },
    slug: { 
      type: String 
    },
  id: { 
    type: Number
   },
  maxLevel: { 
    type: Number
     },
  maxEvolutionLevel: { 
    type: Number
     },
  elixirCost: { 
    type: Number
   },
  iconUrls: {
    medium: { type: String, required: true },
    evolutionMedium: { type: String, required: false }
  },
  rarity: {
     type: String
     }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
