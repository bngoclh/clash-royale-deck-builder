const findMostUsedDeck = (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck

  // Parcourt chaque bataille pour analyser les decks utilisés et les résultats des matchs
  battles.forEach((battle) => {
    if (battle.team && battle.team.length > 0) {
      const deck = battle.team[0].cards
        .map((card) => card.name)
        .sort()
        .join(",");
      const elixirSum = battle.team[0].cards.reduce(
        (acc, card) => acc + card.elixirCost,
        0
      );
      const averageElixir = elixirSum / battle.team[0].cards.length;
      const victory = battle.team[0].crowns > battle.opponent[0].crowns;

      if (!deckUsage[deck]) {
        deckUsage[deck] = {
          count: 0,
          elixir: averageElixir,
          wins: 0,
          losses: 0,
        };
      }

      deckUsage[deck].count += 1;
      if (victory) {
        deckUsage[deck].wins += 1;
      } else {
        deckUsage[deck].losses += 1;
      }
    }
  });

  console.log("Deck usage statistics:", deckUsage);

  const sortedDecks = Object.entries(deckUsage).sort(
    (a, b) => b[1].count - a[1].count
  );

  // Conditions :
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

  if (
    sortedDecks.length > 0 &&
    sortedDecks[0][1].count === 1 &&
    sortedDecks.length === battles.length
  ) {
    return {
      message:
        "Pas de deck le + utilisé pour ce joueur, svp essayez avec un autre joueur",
    };
  }

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

  const bestDeck = mostUsedDecks.sort((a, b) => a[1].elixir - b[1].elixir)[0];
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
