// Trong file ResultGrid.tsx
import { Grid } from "@chakra-ui/react";
import WinPieChart from "./WinRateChart";

const ResultGrid = ({ results }: { results: any }) => {
  // Destructure the results object to get the data
  const { playerName, elixir, count, cardNames, winRate } = results;

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
            {/* Map over your results and display each one */}
            {cardNames.map((cardName: any) => (
              <div>
                <img src={`/${cardName}.png`} alt={cardName} />
                {/* Các chi tiết khác như elixir và count cũng có thể được hiển thị ở đây */}
              </div>
            ))}
          </Grid>
          <p className="mt-5 text-left">Count: {count}</p>
          <p className="text-left">Avergae Elixir: {elixir}</p>
          <p className="text-left">Rare card: à finir après</p>
        </div>
      </nav>
    </>
  );
};

export default ResultGrid;
