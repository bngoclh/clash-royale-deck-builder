const express = require("express");
const router = express.Router();
const {findDocument} = require("../controllers/synergie.cards")

router.get("/favoritecards/:playertag", async (req, res) => {
    const playerTag = req.params.playertag;
    console.log(playerTag);

    try {
        console.log(`Received request to get favorite cards for player ${playerTag}`);
        const cards = await findDocument(playerTag);

        
       // console.log(playerTag);
//ecrire le comptage des cartes les plus présentes

        res.json(cards);
    } catch (error) {
        console.error(
            `Error processing request for player ${playerTag}:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
