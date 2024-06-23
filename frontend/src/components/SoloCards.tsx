import React from "react";
import { Box, Text, Image, Grid } from "@chakra-ui/react";

interface SoloCardProps {
  soloCards: {
    cardName: string;
    alternatives: string[];
  }[];
}

const SoloCards: React.FC<SoloCardProps> = ({ soloCards }) => {
  const firstCard = soloCards[0];

  if (soloCards.length === 0) {
    return (
      <Box mt={6} textAlign="center">
        <Text fontSize={["2xl", "3xl"]} fontWeight="bold" color="white">
          Le deck est bien construit
        </Text>
      </Box>
    );
  }

  return (
    <Box mt={6} textAlign="center">
      <Text fontSize={["2xl", "3xl"]} fontWeight="bold" color="white">
        Improvement of your deck
      </Text>
      <Text fontSize="sm" color="white" mt={4}>
        We have found some cards in your deck that do not seem to work well with
        the others. Here are our suggestions to improve your deck.
      </Text>

      <Grid templateColumns={["1fr", "1fr 1fr"]} gap={4} mt={6}>
        <Box>
          <Text fontSize={["lg", "xl"]} color="white">
            Solo Cards
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {soloCards.map((card) => (
              <Box key={card.cardName}>
                <Image
                  boxSize={["75px", "100px", "150px"]}
                  src={`/${card.cardName}.png`}
                  alt={card.cardName}
                />
              </Box>
            ))}
          </Grid>
        </Box>
        <Box>
          <Text fontSize={["lg", "xl"]} color="white">
            Suggested alternatives
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {firstCard.alternatives.map((alt) => (
              <Box key={alt}>
                <Image
                  boxSize={["75px", "100px", "150px"]}
                  src={`/${alt}.png`}
                  alt={alt}
                />
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Text fontSize="sm" color="white" mt={8}>
        Try these new card combinations in your next match!
      </Text>
    </Box>
  );
};

export default SoloCards;
