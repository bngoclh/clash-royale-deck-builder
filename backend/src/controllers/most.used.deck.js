const MostUsedDeck = require("../models/most.used.deck.model");
const Synergy = require("../models/cards.synergy.model");

// Fonction pour trouver le deck le plus utilisé
const findMostUsedDeck = async (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck

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
      const victory = battle.team[0].crowns > battle.opponent[0].crowns;

      // Si le deck n'a pas encore été rencontré, initialise ses valeurs
      if (!deckUsage[deckKey]) {
        deckUsage[deckKey] = {
          count: 0,
          elixir: averageElixir,
          wins: 0,
          losses: 0,
          cards: deck,
        };
      }

      // Incrémente le compteur d'utilisation pour ce deck
      deckUsage[deckKey].count += 1;
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
    const solo_cards = await soloCards(deck.cards);
    const cardProposals = await getCardProposals(solo_cards, deck.cards);

    // Structure the solo_cards with alternatives
    const soloCardsWithAlternatives = solo_cards.map((card) => ({
      card_name: card,
      alternatives: cardProposals[card].filter(Boolean), // Filtrer les alternatives pour s'assurer qu'elles sont valides
    }));

    return {
      mostUsedDeck: sortedDecks[0][0],
      elixir: deck.elixir,
      winRate: `${winRate.toFixed(2)}%`,
      count: deck.count,
      cards: deck.cards,
      synergies,
      solo_cards: soloCardsWithAlternatives,
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
  const solo_cards = await soloCards(bestDeck[1].cards);
  const cardProposals = await getCardProposals(solo_cards, bestDeck[1].cards);

  // Structure the solo_cards with alternatives
  const soloCardsWithAlternatives = solo_cards.map((card) => ({
    card_name: card,
    alternatives: cardProposals[card].filter(Boolean), // Filtrer les alternatives pour s'assurer qu'elles sont valides
  }));

  return {
    mostUsedDeck: bestDeck[0],
    elixir: bestDeck[1].elixir,
    winRate: `${winRate.toFixed(2)}%`,
    count: bestDeck[1].count,
    cards: bestDeck[1].cards,
    synergies,
    solo_cards: soloCardsWithAlternatives,
  };
};

// Fonction pour obtenir les synergies
const getSynergies = async (deck) => {
  const synergies_list = [];

  // Cherche les données de synergies pour les cartes du deck
  const synergyData = await Synergy.find({
    name: { $in: deck.map((card) => card.name) },
  });

  for (let i = 0; i < deck.length; i++) {
    const cardA = deck[i];
    const cardSynergies = { card: cardA.name, synergies_list: [] };

    for (let j = i + 1; j < deck.length; j++) {
      const cardB = deck[j];

      const synergyA = synergyData.find((s) => s.name === cardA.name);
      const synergyB = synergyData.find((s) => s.name === cardB.name);

      if (synergyA && synergyB) {
        const cardBSynergy = synergyA.synergies.find(
          (s) => s.card_slug === cardB.name
        );
        const cardASynergy = synergyB.synergies.find(
          (s) => s.card_slug === cardA.name
        );

        if (cardBSynergy || cardASynergy) {
          cardSynergies.synergies_list.push(cardB.name);
        }
      }
    }

    synergies_list.push(cardSynergies);
  }

  return synergies_list;
};

const soloCards = async (deck) => {
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
            (s) => s.card_slug === cardB.name
          );
          const cardASynergy = synergyB.synergies.find(
            (s) => s.card_slug === cardA.name
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
        card.synergies.filter((s) =>
          usedDeck.map((c) => c.name).includes(s.card_slug)
        ).length >= 4
      ) {
        proposals[soloCard].push(card.name);
      }
    }

    // Filtrer les alternatives pour enlever les valeurs indéfinies ou vides
    proposals[soloCard] = proposals[soloCard].filter(
      (alternative) => alternative
    );
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
    synergies: mostUsedDeckData.synergies,
    solo_cards: mostUsedDeckData.solo_cards.map((card) => ({
      card_name: card.card_name,
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
