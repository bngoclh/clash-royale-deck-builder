const findMostUsedDeck = (battles) => {
  const deckUsage = {}; // Dictionnaire pour compter l'utilisation de chaque deck

  // Parcourt chaque bataille pour analyser les decks utilisés
  battles.forEach((battle) => {
    if (battle.team && battle.team.length > 0) {
      // Crée une représentation unique du deck en triant les noms des cartes
      const deck = battle.team[0].cards
        .map((card) => card.name)
        .sort()
        .join(", ");
      const elixirSum = battle.team[0].cards.reduce(
        (acc, card) => acc + card.elixirCost,
        0
      );
      const averageElixir = elixirSum / battle.team[0].cards.length;

      // Si le deck n'a pas encore été rencontré, initialise ses valeurs
      if (!deckUsage[deck]) {
        deckUsage[deck] = { count: 0, elixir: averageElixir };
      }

      // Incrémente le compteur d'utilisation pour ce deck
      deckUsage[deck].count += 1;
    }
  });

  console.log("Les decks utilisé pour les 25 dernières matchs:", deckUsage);

  // Transforme le dictionnaire en une liste triée des decks par leur utilisation (décroissante)
  const sortedDecks = Object.entries(deckUsage).sort(
    (a, b) => b[1].count - a[1].count
  );

  //Joueur joue avec un seul deck pour tous les matchs
  if (sortedDecks.length === 1) {
    return {
      mostUsedDeck: sortedDecks[0][0],
      elixir: sortedDecks[0][1].elixir,
    };
  }

  //Le joueur joue un deck différent pour chaque match
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

  //Il existe plus qu'un deck le plus utilisé
  const mostUsedDecks = sortedDecks.filter(
    (deck) => deck[1].count === sortedDecks[0][1].count
  );
  if (mostUsedDecks.length === 1) {
    return {
      mostUsedDeck: mostUsedDecks[0][0],
      elixir: mostUsedDecks[0][1].elixir,
    };
  }
  //on choisit le deck le plus utilisé avec le coût moyen d'elixir le plus faible
  const bestDeck = mostUsedDecks.sort((a, b) => a[1].elixir - b[1].elixir)[0];
  return { mostUsedDeck: bestDeck[0], elixir: bestDeck[1].elixir };
};

module.exports = { findMostUsedDeck };
