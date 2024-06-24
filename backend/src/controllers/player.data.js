const axios = require("axios");

// Appel API pour récupérer les informations du joueur, y compris son nom
const getPlayerInfo = async (playertag) => {
  try {
    const response = await axios.get(
      `https://api.clashroyale.com/v1/players/%23${playertag}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError(error, playertag);
  }
};

const handleError = (error, playertag) => {
  if (error.response) {
    console.error(
      `Error retrieving data for player ${playertag}:`,
      error.response.data
    );
    throw new Error(`Failed to retrieve data: ${error.response.data.message}`);
  } else if (error.request) {
    console.error(
      `No response received for player ${playertag}:`,
      error.request
    );
    throw new Error("Failed to retrieve data: No response received");
  } else {
    console.error(
      `Error setting up request for player ${playertag}:`,
      error.message
    );
    throw new Error(`Failed to retrieve data: ${error.message}`);
  }
};

module.exports = { getPlayerInfo };
