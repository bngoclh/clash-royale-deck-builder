import { Box, Grid, Image, Text, Tooltip } from "@chakra-ui/react";

type Top8OpponentCardsProps = {
  top8OpponentCards: {
    name: string;
    totalCount: number;
    elixirCost: number;
    rarity: string;
  }[];
};

const Top8OpponentCards = ({ top8OpponentCards }: Top8OpponentCardsProps) => {
  return (
    <Box mt={6} textAlign="center">
      <Text className="text-3xl font-bold text-purple-400 mt-5">
        Top 8 Opponent Cards
      </Text>
      <Grid templateColumns="repeat(8, 1fr)" gap={3} mt={6}>
        {top8OpponentCards.map((card) => (
          <Tooltip key={card.name} label={card.name}>
            <Image
              src={`/${card.name}.png`}
              alt={card.name}
              boxSize={["50px", "150px", "150px"]}
              maxW="100%"
              height="auto"
              objectFit="contain"
            />
          </Tooltip>
        ))}
      </Grid>
    </Box>
  );
};

export default Top8OpponentCards;
