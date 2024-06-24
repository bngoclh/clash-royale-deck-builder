import { Box, Text, Image, Grid } from "@chakra-ui/react";

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
      <Text fontSize={["2xl", "3xl"]} fontWeight="bold" color="white">
        Les decks les plus performants contre votre deck
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={6}>
        {winningOpponents.map((opponent, index) => (
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
                <Box key={card.name}>
                  <Image
                    boxSize={["25px", "70px", "70px"]}
                    src={`/${card.name}.png`}
                    alt={card.name}
                  />
                </Box>
              ))}
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default WinningOpponents;
