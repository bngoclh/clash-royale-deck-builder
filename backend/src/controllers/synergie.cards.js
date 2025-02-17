const Battlelog = require("../models/battlelog.model");
const Synergy = require("../models/cards.synergy.model");

const DeckSynergy = require("../models/deck.synergy.model");


const { getPlayerBattles } = require("../controllers/player.battlelog");


const findDocument = async (playertag) => {
    try {
/*
        const reccupbattle = await Battlelog.find({ battleId: playertag }).select('battlelog');
        const listbattle = reccupbattle[0].battlelog;
*/
        const listbattle = await getPlayerBattles(playertag);
        //const listbattle = battlog.battlelog;

        //console.log("liste de battlelog", listbattle)

        const listecards = listbattle.map((battle) => battle.team[0].cards.map((card) => card.name));

        const countOccurrences = listecards.flat().reduce((acc, card) => {
            acc[card] = (acc[card] || 0) + 1;
            return acc;
        }, {});

        const sortedOccurrences = Object.entries(countOccurrences).sort((a, b) => b[1] - a[1]);

        //console.log('Occurrences in descending order:');

        const result = sortedOccurrences.map(([card, count]) => ({ card, count }))
            .sort((a, b) => b.count - a.count)
            .map(({ card }) => card);

        const favcards = [result[0], result[1], result[2]]

        const reccupsynergy = await Synergy.find();
        const listslug = reccupsynergy

        const filteredSlug = listslug.filter((item) => favcards.includes(item.name));


        const commonCounters = filteredSlug
            .map((item) => item.counters.map((card) => card.card_slug))
            .flat()
            .reduce((acc, card) => {
                acc[card] = (acc[card] || 0) + 1;
                return acc;
            }, {});

        const sortedCounters = Object.entries(commonCounters).sort((a, b) => b[1] - a[1]);

        //console.log('Counters in descending order:');
        //console.log(sortedCounters);


        //console.log(commonCounters);

        const topCounters = sortedCounters.slice(0, 5);
        const firstElements = topCounters.map(([card, count]) => card);
        console.log(firstElements);

        const mergedList = [...favcards, ...firstElements];


        const deckSynergy = new DeckSynergy({
            tagname: playertag,
            deck_synergy: mergedList
        });

        await deckSynergy.save();

        if (firstElements) {
            return mergedList;
        } else {
            console.log('No document found with the specified battleId');
        }



        // Close the connection
        // client.close();
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}

module.exports = { findDocument }