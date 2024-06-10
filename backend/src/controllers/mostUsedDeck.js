const findMostUsedDeck = (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck

  // Parcourt chaque bataille pour analyser les decks utilisés et les résultats des matchs
  battles.forEach((battle) => {
    if (battle.team && battle.team.length > 0) {
      // Crée une représentation unique du deck en triant les noms des cartes
      const deck = battle.team[0].cards
        .map((card) => card.name)
        .sort()
        .join(",");
      // Calcule le coût moyen en élixir du deck
      const elixirSum = battle.team[0].cards.reduce(
        (acc, card) => acc + card.elixirCost,
        0
      );
      const averageElixir = elixirSum / battle.team[0].cards.length;
      // Détermine si la bataille est une victoire
      const victory = battle.team[0].crowns > battle.opponent[0].crowns;

      // Si le deck n'a pas encore été rencontré, initialise ses valeurs
      if (!deckUsage[deck]) {
        deckUsage[deck] = {
          count: 0,
          elixir: averageElixir,
          wins: 0,
          losses: 0,
        };
      }

      // Incrémente le compteur d'utilisation pour ce deck
      deckUsage[deck].count += 1;
      // Incrémente le compteur de victoires ou de défaites pour ce deck
      if (victory) {
        deckUsage[deck].wins += 1;
      } else {
        deckUsage[deck].losses += 1;
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
    return {
      mostUsedDeck: sortedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count, // Ajout du nombre de fois que le deck a été utilisé
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
        "Le joueur utilise un deck différent pour chaque match, veuillez essayer avec un autre joueur.",
    };
  }

  // Si plusieurs decks sont les plus utilisés
  const mostUsedDecks = sortedDecks.filter(
    (deck) => deck[1].count === sortedDecks[0][1].count
  );
  if (mostUsedDecks.length === 1) {
    const deck = mostUsedDecks[0][1];
    const winRate = (deck.wins / (deck.wins + deck.losses)) * 100;
    return {
      mostUsedDeck: mostUsedDecks[0][0],
      elixir: deck.elixir,
      winRate: winRate.toFixed(2) + "%",
      count: deck.count, // Ajout du nombre de fois que le deck a été utilisé
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
  return {
    mostUsedDeck: bestWinRateDeck[0],
    elixir: bestWinRateDeck[1].elixir,
    winRate: winRate.toFixed(2) + "%",
    count: bestWinRateDeck[1].count, // Ajout du nombre de fois que le deck a été utilisé
  };
};

module.exports = { findMostUsedDeck };
