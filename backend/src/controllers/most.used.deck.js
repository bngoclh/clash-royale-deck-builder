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
      const victory = battle.team[0].crowns > battle.opponent[0].crowns;

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
    return {
      mostUsedDeck: sortedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count,
      cards: deck.cards,
      synergies,
      opponents: deck.opponents,
      top8OpponentCards,
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
      top8OpponentCards,
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
    return {
      mostUsedDeck: mostUsedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count,
      cards: deck.cards,
      synergies,
      opponents: deck.opponents,
      top8OpponentCards,
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

  return {
    mostUsedDeck: bestWinRateDeck[0],
    elixir: bestWinRateDeck[1].elixir,
    winRate: winRate.toFixed(2) + "%",
    count: bestWinRateDeck[1].count,
    cards: bestWinRateDeck[1].cards,
    synergies,
    opponents: bestWinRateDeck[1].opponents,
    top8OpponentCards,
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

  for (let i = 0; i < deck.length; i++) {
    const cardA = deck[i];
    synergies[cardA.name] = [];

    for (let j = 0; j < deck.length; j++) {
      if (i !== j) {
        const cardB = deck[j];

        try {
          const synergyA = allSynergies.find(
            (synergy) => synergy.name === cardA.name
          );
          const synergyB = allSynergies.find(
            (synergy) => synergy.name === cardB.name
          );

          if (synergyA && synergyB) {
            const cardBSynergy = synergyA.synergies.find(
              (synergy) => synergy.card_slug === cardB.name
            );
            const cardASynergy = synergyB.synergies.find(
              (synergy) => synergy.card_slug === cardA.name
            );

            if (cardBSynergy || cardASynergy) {
              synergies[cardA.name].push(cardB.name);
            }
          }
        } catch (error) {
          console.error("Error fetching synergies:", error);
        }
      }
    }
  }
  return synergies;
};

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