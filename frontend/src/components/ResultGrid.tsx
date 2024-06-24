import { Grid } from "@chakra-ui/react";
import WinPieChart from "./WinRateChart";
import TrophyChangeLineChart from "./TrophyChangeChart";
import SoloCards from "./SoloCards";
import WinningOpponents from "./WinningOpponents";

const ResultGrid = ({ results }: { results: any }) => {
  const {
    playerName,
    elixir,
    count,
    cardNames,
    winRate,
    trophyChanges,
    numberOfBattles,
    soloCards,
    winningOpponents,
  } = results;

  return (
    <>
      <h1 className="text-2xl text-white mt-6">Player Name: {playerName}</h1>

      <nav className="grid grid-cols-2 gap-2 mx-1 mt-10">
        <div>
          <WinPieChart winRate={winRate} />
        </div>
        <div className="font-normal text-base">
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {cardNames.map((cardName: any) => (
              <div key={cardName}>
                <img src={`/${cardName}.png`} alt={cardName} />
              </div>
            ))}
          </Grid>
          <p className="mt-5 text-left">
            Count: {count} / {numberOfBattles}
          </p>
          <p className="text-left">Average Elixir: {elixir}</p>
          <p className="text-left">Rare card: à finir après</p>
        </div>
      </nav>
      <TrophyChangeLineChart trophyChanges={trophyChanges} />
      <SoloCards soloCards={soloCards} />
      <WinningOpponents winningOpponents={winningOpponents} />
    </>
  );
};

export default ResultGrid;
