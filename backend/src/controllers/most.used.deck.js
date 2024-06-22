const MostUsedDeck = require("../models/most.used.deck.model");
const Synergy = require("../models/cards.synergy.model");

// Function to find the most used deck
const findMostUsedDeck = async (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck

  // Parcourt chaque bataille pour analyser les decks utilisés et les résultats des matchs
  battles.forEach((battle) => {
    if (
      battle.team &&
      battle.team.length > 0 &&
      battle.opponent &&
      battle.opponent.length > 0
    ) {
      const teamDeck = battle.team[0].cards.map((card) => {
        return {
          name: card.name,
          elixirCost: card.elixirCost,
          rarity: card.rarity,
        };
      });
      const opponentDeck = battle.opponent[0].cards.map((card) => {
        return {
          name: card.name,
          elixirCost: card.elixirCost,
          rarity: card.rarity,
        };
      });

      // Crée une clé unique pour le deck basée sur les noms des cartes triés
      const deckKey = teamDeck
        .map((card) => card.name)
        .sort()
        .join(",");

      // Calcule le coût moyen en élixir du deck
      const elixirSum = teamDeck.reduce(
        (acc, card) => acc + card.elixirCost,
        0
      );
      const averageElixir = elixirSum / teamDeck.length;

      // Détermine si la bataille est une victoire
      let victory;
      if (battle.team[0].trophyChange && battle.opponent[0].trophyChange) {
        victory = battle.team[0].trophyChange > battle.opponent[0].trophyChange;
      } else {
        victory = battle.team[0].crowns > battle.opponent[0].crowns;
      }

      // Si le deck n'a pas encore été rencontré, initialise ses valeurs
      if (!deckUsage[deckKey]) {
        deckUsage[deckKey] = {
          count: 0,
          elixir: averageElixir,
          wins: 0,
          losses: 0,
          cards: teamDeck, // Stocke le tableau d'objets de cartes
          opponents: [],
          cardsCount: {}, // Initialisation du compteur des cartes des adversaires pour ce deck
        };
      }

      // Incrémente le compteur d'utilisation pour ce deck
      deckUsage[deckKey].count += 1;

      // Incrémente le compteur de victoires ou de défaites pour ce deck
      if (victory) {
        deckUsage[deckKey].wins += 1;
      } else {
        deckUsage[deckKey].losses += 1;
      }

      // Ajoute le deck de l'opposant à la liste des decks d'opposants
      deckUsage[deckKey].opponents.push(opponentDeck);
    }
  });

  // Affichage des statistiques d'utilisation des decks
  console.log("Deck usage statistics:", deckUsage);

  // Transforme le dictionnaire en une liste triée des decks par leur utilisation (décroissante)
  const sortedDecks = Object.entries(deckUsage).sort(
    (a, b) => b[1].count - a[1].count
  );

  // Sélection des 8 cartes les plus utilisées par les adversaires au total
  const top8OpponentCards = findMostUsedOpponentCards(battles);

  // Conditions pour déterminer le deck le plus utilisé
  if (sortedDecks.length === 1) {
    const deck = sortedDecks[0][1];
    const winRate = (deck.wins / (deck.wins + deck.losses)) * 100;
    const synergies = await getSynergies(deck.cards);

    // Appel de la fonction pour trouver les adversaires ayant gagné contre le deck le plus utilisé
    const WinningOpponents = findWinningOpponents(battles, sortedDecks[0][0]);

    return {
      mostUsedDeck: sortedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count,
      cards: deck.cards,
      synergies,
      top8OpponentCards,
      WinningOpponents,
    };
  }

  // Si le joueur utilise un deck différent pour chaque match
  if (
    sortedDecks.length > 0 &&
    sortedDecks[0][1].count === 1 &&
    sortedDecks.length === battles.length
  ) {
    return {
      message:
        "Le joueur utilise un deck différent pour chaque match. Il est recommandé de jouer avec plusieurs decks pour obtenir des statistiques plus significatives.",
      // Assurez-vous que WinningOpponents est défini même dans ce cas
    };
  }

  // Si plusieurs decks sont les plus utilisés
  const mostUsedDecks = sortedDecks.filter(
    (deck) => deck[1].count === sortedDecks[0][1].count
  );

  if (mostUsedDecks.length === 1) {
    const deck = mostUsedDecks[0][1];
    const winRate = (deck.wins / (deck.wins + deck.losses)) * 100;
    const synergies = await getSynergies(deck.cards);

    // Appel de la fonction pour trouver les adversaires ayant gagné contre le deck le plus utilisé
    const WinningOpponents = findWinningOpponents(battles, mostUsedDecks[0][0]);

    return {
      mostUsedDeck: mostUsedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count,
      cards: deck.cards,
      synergies,
      top8OpponentCards,
      WinningOpponents,
    };
  }

  // Sélection du deck le plus utilisé avec le coût moyen d'élixir le plus faible
  const bestDeck = mostUsedDecks.sort((a, b) => a[1].elixir - b[1].elixir)[0];
  // Sélection du deck avec le meilleur taux de victoire
  const bestWinRateDeck = mostUsedDecks.sort((a, b) => {
    const winRateA = a[1].wins / (a[1].wins + a[1].losses);
    const winRateB = b[1].wins / (b[1].wins + b[1].losses);
    return winRateB - winRateA;
  })[0];

  const winRate =
    (bestWinRateDeck[1].wins /
      (bestWinRateDeck[1].wins + bestWinRateDeck[1].losses)) *
    100;
  const synergies = await getSynergies(bestWinRateDeck[1].cards);

  // Appel de la fonction pour trouver les adversaires ayant gagné contre le deck le plus utilisé
  const WinningOpponents = findWinningOpponents(battles, bestDeck[0]);

  return {
    mostUsedDeck: bestDeck[0],
    elixir: bestDeck[1].elixir,
    winRate: winRate.toFixed(2) + "%",
    count: bestDeck[1].count,
    cards: bestDeck[1].cards,
    synergies,
    top8OpponentCards,
    WinningOpponents,
  };
};

///////////////////////////////////////////////
const findMostUsedOpponentCards = (battles) => {
  const cardsTotalCount = {};

  battles.forEach((battle) => {
    if (battle.opponent && battle.opponent.length > 0) {
      const opponentDeck = battle.opponent[0].cards;
      opponentDeck.forEach((card) => {
        const cardName = card.name;
        if (!cardsTotalCount[cardName]) {
          cardsTotalCount[cardName] = {
            name: cardName, // Assure que le champ 'name' est présent
            totalCount: 0, // Initialiser 'totalCount' pour chaque carte
            elixirCost: card.elixirCost,
            rarity: card.rarity,
          };
        }
        cardsTotalCount[cardName].totalCount++; // Incrémente 'totalCount' pour chaque carte
      });
    }
  });

  const allCardsSorted = Object.entries(cardsTotalCount).sort(
    (a, b) => b[1].totalCount - a[1].totalCount
  );

  const top8OpponentCards = allCardsSorted
    .slice(0, 8)
    .map(([cardName, cardInfo]) => cardInfo);

  return top8OpponentCards;
};

const getSynergies = async (deck) => {
  const synergies = {};

  const allSynergies = await Synergy.find({
    name: { $in: deck.map((card) => card.name) },
  });

  for (let cardA of deck) {
    synergies[cardA.name] = [];
    for (let cardB of deck) {
      if (cardA.name !== cardB.name) {
        try {
          const synergyA = allSynergies.find(
            (synergy) => synergy.name === cardA.name
          );
          const synergyB = synergyA.synergies.find(
            (synergy) => synergy.name === cardB.name
          );

          if (synergyB) {
            synergies[cardA.name].push({
              name: cardB.name,
              elixirCost: cardB.elixirCost,
              synergy: synergyB.synergy,
            });
          }
        } catch (error) {
          console.error(
            `Error while calculating synergy between ${cardA.name} and ${cardB.name}:`,
            error.message
          );
        }
      }
    }
  }

  return synergies;
};



//////////////////////////////////////
const findWinningOpponents = (battles, mostUsedDeck) => {
  const WinningOpponents = [];

  battles.forEach((battle) => {
    // Ajout de journaux pour vérifier les données d'entrée
    console.log("Battle data:", JSON.stringify(battle, null, 2));
    
    if (
      battle.team &&
      battle.team.length > 0 &&
      battle.opponent &&
      battle.opponent.length > 0
    ) {
      // Créez la représentation en chaîne du deck de l'équipe
      const teamDeck = battle.team[0].cards
        .map((card) => card.name)
        .sort()
        .join(",");
      
      console.log(`Comparing decks: Team Deck: ${teamDeck}, Most Used Deck: ${mostUsedDeck}`);
      
      if (
        teamDeck === mostUsedDeck &&
        battle.team[0].trophyChange < battle.opponent[0].trophyChange
      ) {
        const opponentDeck = battle.opponent[0].cards.map((card) => ({
          name: card.name,
          elixirCost: card.elixirCost,
          rarity: card.rarity,
        }));
        console.log(`Adding losing opponent: ${battle.opponent[0].name}`);
        WinningOpponents.push({
          opponentName: battle.opponent[0].name, // Ajout du nom de l'adversaire
          opponentDeck: opponentDeck,
        });
      } else {
        console.log("No match found for this battle.");
      }
    } else {
      console.log("Invalid battle data: Missing team or opponent information.");
    }
  }); // Ici, vous avez oublié de fermer la fonction forEach

  console.log("Losing opponents found:", JSON.stringify(WinningOpponents, null, 2));
  return WinningOpponents;
};

///////////////////////////
// Fonction pour sauvegarder le deck le plus utilisé dans la base de données
const saveMostUsedDeck = async (playertag, playerName, mostUsedDeckData) => {
  console.log("Preparing to save most used deck:", mostUsedDeckData);

  const mostUsedDeck = new MostUsedDeck({
    playertag,
    playerName,
    cards: mostUsedDeckData.cards,
    elixir: mostUsedDeckData.elixir,
    winRate: mostUsedDeckData.winRate,
    count: mostUsedDeckData.count,
    top8OpponentCards: mostUsedDeckData.top8OpponentCards,
    WinningOpponents: mostUsedDeckData.WinningOpponents,
  });
  try {
    await mostUsedDeck.save();
    console.log("Most used deck saved to the database");
  } catch (error) {
    console.error(
      "Error saving most used deck to the database:",
      error.message
    );
    throw new Error("Failed to save most used deck to the database");
  }
};

module.exports = {
  findMostUsedDeck,
  saveMostUsedDeck,
};