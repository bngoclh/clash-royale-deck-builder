const express = require("express");
const router = express.Router();
const { getPlayerBattles } = require("../controllers/player.battlelog");
const { getPlayerInfo } = require("../controllers/player.data");
const { findMostUsedDeck, saveMostUsedDeck } = require("../controllers/most.used.deck");

// Route GET pour obtenir le deck le plus utilisé par un joueur et les decks des adversaires
router.get("/mostuseddeck/:playertag", async (req, res) => {
  const playerTag = req.params.playertag;

  try {
    console.log(`Received request to get most used deck for player ${playerTag}`);

    // Obtenir les informations sur le joueur
    const playerInfo = await getPlayerInfo(playerTag);
    const playerName = playerInfo.name;
    console.log(`Retrieved player name: ${playerName}`);

    // Obtenir les batailles du joueur
    const battles = await getPlayerBattles(playerTag);
    console.log(`Analyzing decks for player ${playerTag}`);

    // Trouver le deck le plus utilisé
    const mostUsedDeck = await findMostUsedDeck(battles);
    console.log("Most used deck:", mostUsedDeck);

    // Sauvegarder le deck le plus utilisé avec les top8OpponentCards
    const top8OpponentCards = mostUsedDeck.top8OpponentCards;
    await saveMostUsedDeck(playerTag, playerName, mostUsedDeck,top8OpponentCards);

    // Répondre avec les données
    res.json({ playerName, mostUsedDeck });
  } catch (error) {
    console.error(`Error processing request for player ${playerTag}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
