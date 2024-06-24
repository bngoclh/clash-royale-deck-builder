import { Box, Text, Image, Grid, Tooltip } from "@chakra-ui/react";

type WinningOpponentsProps = {
  winningOpponents: {
    opponentName: string;
    opponentDeck: {
      name: string;
      elixirCost: number;
      rarity: string;
    }[];
  }[];
};

const WinningOpponents = ({ winningOpponents }: WinningOpponentsProps) => {
  return (
    <Box mt={6} textAlign="center">
      <Text className="text-3xl font-bold text-purple-400 mt-8">
        Be careful with these players' decks in the coming matches!
      </Text>
      <Grid
        templateColumns={["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
        gap={4}
        mt={6}
      >
        {winningOpponents.map((opponent, index) => {
          const totalElixirCost = opponent.opponentDeck.reduce(
            (sum, card) => sum + card.elixirCost,
            0
          );
          const averageElixirCost =
            opponent.opponentDeck.length > 0
              ? totalElixirCost / opponent.opponentDeck.length
              : 0;

          return (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
            >
              <Text fontSize="sm" color="white" mb={4}>
                {opponent.opponentName}
              </Text>

              <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                {opponent.opponentDeck.map((card) => (
                  <Tooltip key={card.name} label={card.name}>
                    <Box key={card.name}>
                      <Image
                        boxSize={["50px", "70px", "90px"]}
                        src={`/${card.name}.png`}
                        alt={card.name}
                        objectFit="contain"
                      />
                    </Box>
                  </Tooltip>
                ))}
              </Grid>
              <Box display="flex" alignItems="center" mt={2}>
                <Text className="text-sm font-normal justify-center">
                  Average Elixir: {averageElixirCost.toFixed(1)}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WinningOpponents;






// import { Box, Text, Image, Grid, Tooltip } from "@chakra-ui/react";

// type WinningOpponentsProps = {
//   winningOpponents: {
//     opponentName: string;
//     opponentDeck: {
//       name: string;
//       elixirCost: number;
//       rarity: string;
//     }[];
//   }[];
// };

// const WinningOpponents = ({ winningOpponents }: WinningOpponentsProps) => {
//   return (
//     <Box mt={6} textAlign="center">
//       <Text className="text-3xl font-bold text-purple-400 mt-8">
//       Be careful with these players' decks in the coming matches!
//       </Text>
//       <Grid
//         templateColumns={["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
//         gap={4}
//         mt={6}
//       >
//         {winningOpponents.map((opponent, index) => {
//           const totalElixirCost = opponent.opponentDeck.reduce(
//             (sum, card) => sum + card.elixirCost,
//             0
//           );
//           const averageElixirCost =
//             opponent.opponentDeck.length > 0
//               ? totalElixirCost / opponent.opponentDeck.length
//               : 0;

//           return (
//             <Box
//               key={index}
//               borderWidth="1px"
//               borderRadius="lg"
//               overflow="hidden"
//               p={4}
//             >
//               <Text fontSize="sm" color="white" mb={4}>
//                 {opponent.opponentName}
//               </Text>

//               <Grid templateColumns="repeat(4, 1fr)" gap={2}>
//                 {opponent.opponentDeck.map((card) => (
//                   <Tooltip key={card.name} label={card.name}>
//                     <Box key={card.name}>
//                       <Image
//                         boxSize={["50px", "70px", "90px"]}
//                         src={`/${card.name}.png`}
//                         alt={card.name}
//                         objectFit="contain"
//                       />
//                     </Box>
//                   </Tooltip>
//                 ))}
//               </Grid>
//               <Box display="flex" alignItems="center" mt={2}>
//                 <Text fontSize="sm" fontStyle="fw-light" color="white">
//                   Average Elixir: {averageElixirCost.toFixed(1)}
//                 </Text>
//               </Box>
//             </Box>
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// };