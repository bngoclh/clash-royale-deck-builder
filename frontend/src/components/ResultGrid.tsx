// Trong file ResultGrid.tsx
import { Grid } from '@chakra-ui/react';

const ResultGrid = ({ results }: { results: any }) => {
  // Destructure the results object to get the data
  const { playerTag, playerName, elixir, count, cardNames } = results;

  return (
    <>
    <h1 className="text-2xl text-white mt-6">
        Player Name: {playerName}
        </h1>

    <nav className="grid grid-cols-2 gap-4 mx-1 mt-10">
        <div>
            <h3>This is analysis</h3>
        </div>

        <div>
            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {/* Map over your results and display each one */}
            {cardNames.map((cardName:any) => (
            <div>
                <img src={`./public/${cardName}.png`} alt={cardName} />
             <p></p>
            {/* Các chi tiết khác như elixir và count cũng có thể được hiển thị ở đây */}
            </div>
                ))}
            </Grid>
        </div>
    </nav>
    </>
    );
}


export default ResultGrid;
