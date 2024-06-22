const axios = require("axios");
const Battlelog = require("../models/battlelog.model");

// Appel API pour récupérer les données battlelog
const getPlayerBattles = async (playertag) => {
};

const pushBattleLog = async (battlelog,playerTag) =>{
  try {
    const newBattleLog = new Battlelog({
      battleId: playerTag,
      battlelog: battlelog,
    });
    await newBattleLog.save();
    console.log(`Battlelog for player ${battlelog.battlelog} saved successfully`);
  } catch (error) {
    console.error(
      `Error saving battlelog for player ${battlelog.battlelog}:`,
      error.message
    );
    throw new Error(`Failed to save battlelog: ${error.message}`);
  }
}


module.exports = { getPlayerBattles, pushBattleLog};