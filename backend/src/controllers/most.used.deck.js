const MostUsedDeck = require("../models/most.used.deck.model");
const Synergy = require("../models/synergy.model");

// Function to find the most used deck
const findMostUsedDeck = async (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck

  // Parcourt chaque bataille pour analyser les decks utilisés et les résultats des matchs
  battles.forEach((battle) => {
    if (battle.team && battle.team.length > 0) {
      // Utilise un tableau d'objets pour représenter le deck
      const deck = battle.team[0].cards.map((card) => {
        return {
          name: card.name,
          elixirCost: card.elixirCost,
          rarity: card.rarity,
        };
      });
      // Crée une clé unique pour le deck basée sur les noms des cartes triés
      const deckKey = deck
        .map((card) => card.name)
        .sort()
        .join(",");

      // Calcule le coût moyen en élixir du deck
      const elixirSum = deck.reduce((acc, card) => acc + card.elixirCost, 0);
      const averageElixir = elixirSum / deck.length;
      // Détermine si la bataille est une victoire
      const victory = battle.team[0].crowns > battle.opponent[0].crowns;

      // Si le deck n'a pas encore été rencontré, initialise ses valeurs
      if (!deckUsage[deckKey]) {
        deckUsage[deckKey] = {
          count: 0,
          elixir: averageElixir,
          wins: 0,
          losses: 0,
          cards: deck, // Stocke le tableau d'objets de cartes
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
    }
  });

  console.log("Deck usage statistics:", deckUsage);

  // Transforme le dictionnaire en une liste triée des decks par leur utilisation (décroissante)
  const sortedDecks = Object.entries(deckUsage).sort(
    (a, b) => b[1].count - a[1].count
  );

  // Conditions :
  // Si le joueur utilise un seul deck pour tous les matchs
  if (sortedDecks.length === 1) {
    const deck = sortedDecks[0][1];
    const winRate = (deck.wins / (deck.wins + deck.losses)) * 100;
    const synergies = await checkSynergiesInDeck(deck.cards);
    return {
      mostUsedDeck: sortedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count,
      cards: deck.cards,
      synergies,
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
        "Le joueur utilise un deck différent pour chaque match.  Il est recommandé de jouer avec plusieurs decks pour obtenir des statistiques plus significatives.",
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
    };
  }

  // On choisit le deck le plus utilisé avec le coût moyen d'élixir le plus faible
  const bestDeck = mostUsedDecks.sort((a, b) => a[1].elixir - b[1].elixir)[0];
  // On choisit le deck avec le meilleur taux de victoire
  const bestWinRateDeck = mostUsedDecks.sort((a, b) => {
    const winRateA = a[1].wins / (a[1].wins + a[1].losses);
    const winRateB = b[1].wins / (b[1].wins + b[1].losses);
    return winRateB - winRateA;
  })[0];

  const winRate =
    (bestWinRateDeck[1].wins /
      (bestWinRateDeck[1].wins + bestWinRateDeck[1].losses)) *
    100;
  const synergies = await getSynergies(deck.cards);
  return {
    mostUsedDeck: bestWinRateDeck[0],
    elixir: bestWinRateDeck[1].elixir,
    winRate: winRate.toFixed(2) + "%",
    count: bestWinRateDeck[1].count,
    cards: bestWinRateDeck[1].cards,
    synergies,
  };
};

const getSynergies = async (deck) => {
  const synergies = {};

  for (let i = 0; i < deck.length; i++) {
    const cardA = deck[i];
    synergies[cardA.name] = [];

    for (let j = 0; j < deck.length; j++) {
      if (i !== j) {
        const cardB = deck[j];

        try {
          // Utilisez 'name' au lieu de 'slug'
          const synergyA = await Synergy.findOne({ name: cardA.name });
          const synergyB = await Synergy.findOne({ name: cardB.name });

          if (synergyA && synergyB) {
            const cardBSynergy = synergyA.synergies.find(
              (synergy) => synergy.card_slug === cardB.name && synergy.dimmed
            );
            const cardASynergy = synergyB.synergies.find(
              (synergy) => synergy.card_slug === cardA.name && synergy.dimmed
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

  const synergyMessages = [];
  for (const [card, synergisticCards] of Object.entries(synergies)) {
    if (synergisticCards.length > 0) {
      let message = `La carte ${card} a une synergie `;
      if (synergisticCards.length === 1) {
        message += `avec la carte ${synergisticCards[0]}`;
      } else {
        message += `avec les cartes ${synergisticCards.join(", ")}`;
      }
      synergyMessages.push(message);
    }
  }

  return synergyMessages;
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

module.exports = { findMostUsedDeck, saveMostUsedDeck };
