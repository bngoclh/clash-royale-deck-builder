const express = require("express");
const router = express.Router();
const { getBattleLog } = require("../controllers/get.battlelog");

// Route GET pour obtenir les données des batailles d'un joueur
router.get("/battlelog/:playertag", async (req, res) => {
  const playerTag = req.params.playertag;

  try {
    console.log(`Received request to get battle data for player ${playerTag}`);
    const battles = await getBattleLog(playerTag);
    res.json(battles);
    console.log(battles);
  } catch (error) {
    console.error(
      `Error processing request for player ${playerTag}:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
