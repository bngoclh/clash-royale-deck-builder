const express = require("express");
const router = express.Router();
const { getPlayerBattles } = require("../controllers/playerBattlelog");
const { getPlayerInfo } = require("../controllers/playerData");

const {
  findMostUsedDeck,
  saveMostUsedDeck,
} = require("../controllers/mostUsedDeck");

// Route POST pour obtenir les données des batailles d'un joueur
router.post("/getBattleData/:playertag", async (req, res) => {
  const playerTag = req.params.playertag;
  try {
    console.log(`Received request to get battle data for player ${playerTag}`);
    const battles = await getPlayerBattles(playerTag);
    const battleData = battles.map((battle) => ({
      result:
        battle.team[0].crowns > battle.opponent[0].crowns ? "Win" : "Loss",
      playerDeck: battle.team[0].cards.map((card) => card.name),
      opponentDeck: battle.opponent[0].cards.map((card) => card.name),
      playerElixirCost: (
        battle.team[0].cards.reduce((acc, card) => acc + card.elixirCost, 0) /
        battle.team[0].cards.length
      ).toFixed(2),
      opponentElixirCost: (
        battle.opponent[0].cards.reduce(
          (acc, card) => acc + card.elixirCost,
          0
        ) / battle.opponent[0].cards.length
      ).toFixed(2),
      playerCrowns: battle.team[0].crowns,
      opponentCrowns: battle.opponent[0].crowns,
      playerKingTowerHP: battle.team[0].kingTowerHitPoints,
      playerPrincessTowersHP: battle.team[0].princessTowersHitPoints,
      opponentKingTowerHP: battle.opponent[0].kingTowerHitPoints,
      opponentPrincessTowersHP: battle.opponent[0].princessTowersHitPoints,
    }));

    res.json(battleData);
    console.log(battleData);
  } catch (error) {
    console.error(
      `Error processing request for player ${playerTag}:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// Route POST pour obtenir le deck le plus utilisé par un joueur
router.post("/getMostUsedDeck/:playertag", async (req, res) => {
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

    const result = findMostUsedDeck(battles);
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
