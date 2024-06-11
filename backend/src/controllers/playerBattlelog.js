const axios = require("axios");

// Appel API pour récupérer les données battlelog
const getPlayerBattles = async (playertag) => {
  try {
    const response = await axios.get(
      `https://api.clashroyale.com/v1/players/%23${playertag}/battlelog`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const battles = response.data;
    console.log(`Retrieved ${battles.length} battles for player ${playertag}`);
    return battles;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error retrieving battlelog for player ${playertag}:`,
        error.response.data
      );
      throw new Error(
        `Failed to retrieve battlelog: ${error.response.data.message}`
      );
    } else if (error.request) {
      console.error(
        `No response received for player ${playertag}:`,
        error.request
      );
      throw new Error("Failed to retrieve battlelog: No response received");
    } else {
      console.error(
        `Error setting up request for player ${playertag}:`,
        error.message
      );
      throw new Error(`Failed to retrieve battlelog: ${error.message}`);
    }
  }
};

module.exports = { getPlayerBattles };
