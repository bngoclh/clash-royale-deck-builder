const express = require("express");
const router = express.Router();
const { getPlayerBattles } = require("../controllers/player.battlelog");
const { getPlayerInfo } = require("../controllers/player.data");
const {
  findMostUsedDeck,
  saveMostUsedDeck,
} = require("../controllers/most.used.deck");

// Route GET pour obtenir le deck le plus utilisé par un joueur
router.get("/mostuseddeck/:playertag", async (req, res) => {
  const playerTag = req.params.playertag;

  try {
    console.log(
      `Received request to get most used deck for player ${playerTag}`
    );

    const playerInfo = await getPlayerInfo(playerTag);

    const playerName = playerInfo.name;
    console.log(`Retrieved player name: ${playerName}`);

    const battles = await getPlayerBattles(playerTag);
    console.log(`Analyzing decks for player ${playerTag}`);

    const result = await findMostUsedDeck(battles);
    await saveMostUsedDeck(playerTag, playerName, result);
    res.json({ playerName, ...result });
  } catch (error) {
    console.error(
      `Error processing request for player ${playerTag}:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
