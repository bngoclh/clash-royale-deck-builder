const MostUsedDeck = require("../models/most.used.deck.model");
const Synergy = require("../models/cards.synergy.model");

// Fonction pour trouver le deck le plus utilisé
const findMostUsedDeck = async (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck
  const numberOfBattles = battles.length; // Nombre total de batailles
  const trophyChanges = {}; // Dictionnaire pour stocker les trophyChange pour chaque deck

  // Parcourt chaque bataille pour analyser les decks utilisés et les résultats des matchs
  battles.forEach((battle) => {
    if (battle.team && battle.team.length > 0) {
      // Utilise un tableau d'objets pour représenter le deck
      const deck = battle.team[0].cards.map((card) => ({
        name: card.name,
        elixirCost: card.elixirCost,
        rarity: card.rarity,
      }));

      const deckKey = deck
        .map((card) => card.name)
        .sort()
        .join(",");

      // Calcule le coût moyen en élixir du deck
      const elixirSum = deck.reduce((acc, card) => acc + card.elixirCost, 0);
      const averageElixir = elixirSum / deck.length;

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
          cards: deck,
          trophyChanges: [], // Initialise le tableau des trophyChanges
        };
      }

      // Incrémente le compteur d'utilisation pour ce deck
      deckUsage[deckKey].count += 1;

      // Ajoute le trophyChange à la liste des trophyChanges
      if (battle.team[0].trophyChange) {
        deckUsage[deckKey].trophyChanges.push(battle.team[0].trophyChange);
      } else {
        deckUsage[deckKey].trophyChanges.push(0); // Si trophyChange n'est pas disponible, ajoutez 0 ou une valeur par défaut
      }

      if (victory) {
        deckUsage[deckKey].wins += 1;
      } else {
        deckUsage[deckKey].losses += 1;
      }
    }
  });

  const sortedDecks = Object.entries(deckUsage).sort(
    (a, b) => b[1].count - a[1].count
  );

  // Si le joueur utilise un seul deck pour tous les matchs
  if (sortedDecks.length === 1) {
    const deck = sortedDecks[0][1];
    const winRate = (deck.wins / (deck.wins + deck.losses)) * 100;
    const synergies = await getSynergies(deck.cards);
    const soloCards = await getSoloCards(deck.cards);
    const cardProposals = await getCardProposals(soloCards, deck.cards);

    // Structure the soloCards with alternatives
    const soloCardsWithAlternatives = soloCards.map((card) => ({
      cardName: card,
      alternatives: cardProposals[card],
    }));

    return {
      numberOfBattles,
      mostUsedDeck: sortedDecks[0][0],
      elixir: deck.elixir,
      winRate: `${winRate.toFixed(2)}%`,
      count: deck.count,
      cards: deck.cards,
      trophyChanges: deck.trophyChanges, // Inclure les trophyChanges
      synergies,
      soloCards: soloCardsWithAlternatives,
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
    };
  }

  // Si plusieurs decks sont les plus utilisés
  const mostUsedDecks = sortedDecks.filter(
    (deck) => deck[1].count === sortedDecks[0][1].count
  );

  // On choisit le deck le plus utilisé avec le coût moyen d'élixir le plus faible
  const bestDeck = mostUsedDecks.sort((a, b) => a[1].elixir - b[1].elixir)[0];
  const winRate =
    (bestDeck[1].wins / (bestDeck[1].wins + bestDeck[1].losses)) * 100;
  const synergies = await getSynergies(bestDeck[1].cards);
  const soloCards = await getSoloCards(bestDeck[1].cards);
  const cardProposals = await getCardProposals(soloCards, bestDeck[1].cards);

  // Structure the soloCards with alternatives
  const soloCardsWithAlternatives = soloCards.map((card) => ({
    cardName: card,
    alternatives: cardProposals[card],
  }));

  return {
    numberOfBattles,
    mostUsedDeck: bestDeck[0],
    elixir: bestDeck[1].elixir,
    winRate: `${winRate.toFixed(2)}%`,
    count: bestDeck[1].count,
    cards: bestDeck[1].cards,
    trophyChanges: bestDeck[1].trophyChanges,
    synergies,
    soloCards: soloCardsWithAlternatives,
  };
};

// Fonction pour obtenir les synergies
const getSynergies = async (deck) => {
  const synergiesList = [];

  // Cherche les données de synergies pour les cartes du deck
  const synergyData = await Synergy.find({
    name: { $in: deck.map((card) => card.name) },
  });

  for (let i = 0; i < deck.length; i++) {
    const cardA = deck[i];
    const cardSynergies = { card: cardA.name, synergiesList: [] };

    for (let j = i + 1; j < deck.length; j++) {
      const cardB = deck[j];

      const synergyA = synergyData.find((s) => s.name === cardA.name);
      const synergyB = synergyData.find((s) => s.name === cardB.name);

      if (synergyA && synergyB) {
        const cardBSynergy = synergyA.synergies.find(
          (s) => s.card_slug === cardB.name && !s.dimmed
        );
        const cardASynergy = synergyB.synergies.find(
          (s) => s.card_slug === cardA.name && !s.dimmed
        );

        if (cardBSynergy || cardASynergy) {
          cardSynergies.synergiesList.push(cardB.name);
        }
      }
    }

    synergiesList.push(cardSynergies);
  }

  return synergiesList;
};

const getSoloCards = async (deck) => {
  const cardsWithoutSynergies = [];

  // Cherche les données de synergies pour les cartes du deck
  const synergyData = await Synergy.find({
    name: { $in: deck.map((card) => card.name) },
  });

  for (let i = 0; i < deck.length; i++) {
    const cardA = deck[i];
    let hasSynergy = false;

    for (let j = 0; j < deck.length; j++) {
      if (i !== j) {
        const cardB = deck[j];

        const synergyA = synergyData.find((s) => s.name === cardA.name);
        const synergyB = synergyData.find((s) => s.name === cardB.name);

        if (synergyA && synergyB) {
          const cardBSynergy = synergyA.synergies.find(
            (s) => s.card_slug === cardB.name && !s.dimmed
          );
          const cardASynergy = synergyB.synergies.find(
            (s) => s.card_slug === cardA.name && !s.dimmed
          );

          if (cardBSynergy || cardASynergy) {
            hasSynergy = true;
            break;
          }
        }
      }
    }

    if (!hasSynergy) {
      cardsWithoutSynergies.push(cardA.name);
    }
  }

  return cardsWithoutSynergies;
};

// Fonction pour proposer des cartes en fonction des synergies
const getCardProposals = async (soloCards, usedDeck) => {
  const proposals = {};

  // Cherche les données de synergies pour toutes les cartes
  const synergyData = await Synergy.find();

  for (const soloCard of soloCards) {
    proposals[soloCard] = [];

    for (const card of synergyData) {
      if (
        card.synergies.filter(
          (s) => usedDeck.map((c) => c.name).includes(s.card_slug) && !s.dimmed
        ).length >= 4 &&
        !usedDeck.map((c) => c.name).includes(card.name) // Vérifiez que la carte n'est pas déjà dans le deck utilisé
      ) {
        proposals[soloCard].push(card.name);
      }
    }
  }

  return proposals;
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
    numberOfBattles: mostUsedDeckData.numberOfBattles,
    trophyChanges: mostUsedDeckData.trophyChanges,
    synergies: mostUsedDeckData.synergies,
    soloCards: mostUsedDeckData.soloCards.map((card) => ({
      cardName: card.cardName,
      alternatives: card.alternatives.filter(Boolean),
    })),
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
