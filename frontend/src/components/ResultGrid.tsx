import { Grid } from "@chakra-ui/react";
import WinPieChart from "./WinRateChart";
import TrophyChangeLineChart from "./TrophyChangeChart";
import SoloCards from "./SoloCards";
import WinningOpponents from "./WinningOpponents";
import { useEffect, useState } from "react";

const ResultGrid = ({ results, deckSynergyNames }: { results: any, deckSynergyNames: any }) => {
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

  const [cardSynNames, setCardSynNames] = useState([]); // useState là 1 mảng chứa 2 giá trị nên phải const [] chứ ko phải {}

  useEffect(() => {
    if (deckSynergyNames) {
      setCardSynNames(deckSynergyNames); // deckSynergyNames = data 8 cards lấy từ mongoDB thomas
      console.log(deckSynergyNames);
    }
  }, [deckSynergyNames]);

  return (
    <>
      <h1 className="text-2xl text-white mt-6">Player Name: {playerName}</h1>

      <nav className="grid grid-cols-2 gap-7 mx-1 mt-10 mb-10">
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
          <p className="mt-5 text-left text-lg">
            Used: {count} / {numberOfBattles} matches
          </p>
          <p className="text-left text-lg">
            Average Elixir: {elixir}</p>
        </div>
      </nav>
      <TrophyChangeLineChart trophyChanges={trophyChanges} />

      <h2 className="text-3xl font-bold text-purple-400 mt-14">
      Recommended deck with your 3 favorite cards</h2>
      <p className="font-normal text-white text-center text-lg italic mt-5">
      The first 3 cards are your 3 favorites!</p>

      <Grid templateColumns="repeat(4, 1fr)" gap={2} className="w-1/2 h-1/2 mt-8 mb-5 justify-center">
        {cardSynNames.map((cardSynName: any) => (
          <div key={cardSynName}>
            <img src={`/${cardSynName}.png`} alt={cardSynName} />
          </div>
        ))}
      </Grid>

      <SoloCards soloCards={soloCards} />
      <WinningOpponents winningOpponents={winningOpponents} />
    </>
  );
};

export default ResultGrid;
