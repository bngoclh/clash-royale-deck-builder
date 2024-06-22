// Trong file ResultGrid.tsx
import { Grid } from "@chakra-ui/react";
import WinPieChart from "./WinRateChart";

const ResultGrid = ({ results, deckSynergyNames }: { results: any, deckSynergyNames: any }) => {
  // Destructure the results object to get the data
  const { playerName, elixir, count, cardNames, winRate } = results;
  const { cardSynNames = deckSynergyNames ? deckSynergyNames : [] } = deckSynergyNames; // Destructure the deckSynergyNames object to get the data
  console.log(cardSynNames); // use an empty array as a fallback if deckSynergyNames is undefined

  return (
    <>
      <h1 className="text-2xl text-white mt-6">Player Name: {playerName}</h1>

      <nav className="grid grid-cols-2 gap-2 mx-1 mt-10">
        {" "}
        {/* Khoảng trống giữa 2 cột */}
        <div>
          <WinPieChart winRate={winRate} />
        </div>
        <div className="font-normal text-base">
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {cardNames.map((cardName: any) => (
              <div>
                <img src={`/${cardName}.png`} alt={cardName} />
              </div>
            ))}
          </Grid>
          <p className="mt-5 text-left">Count: {count}</p>
          <p className="text-left">Avergae Elixir: {elixir}</p>
          <p className="text-left">Rare card: à finir après</p>

          <h2 className="text-2xl font-bold text-left text-white mt-6">Recommended deck with your 3 favorite cards</h2>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {cardSynNames && cardSynNames.map((cardSynName: any) => ( // Check if cardSynNames is defined before mapping over it
              <div>
                <img src={`/${cardSynName}.png`} alt={cardSynName} />
              </div>
            ))}
          </Grid>
        </div>
      </nav>
    </>
  );
};

export default ResultGrid;
