import { Box, Text, Image, Grid } from "@chakra-ui/react";

interface SoloCardProps {
  soloCards: {
    cardName: string;
    alternatives: string[];
  }[];
}

const SoloCards = ({ soloCards }: SoloCardProps) => {
  const firstCard = soloCards.length > 0 ? soloCards[0] : null;

  if (soloCards.length === 0) {
    return (
      <Box>
      {/* // <Box mt={6} textAlign="center">
      //   <Text className="font-normal text-white text-center text-lg italic mt-5">
      //     We find no
      //   </Text> */}
      </Box>
    );
  }

  return (
    <Box mt={6} textAlign="center">
      <Text className="text-3xl font-bold text-purple-400 mt-3">
        Try upgrade your deck!
      </Text>
      <Text className="font-normal text-white text-center text-lg italic mt-5">
        Oops, we have found some cards in your deck that do not seem to work well with
        the others!
      </Text>

      <Grid templateColumns={["1fr", "1fr 1fr"]} gap={4} mt={6}>
        <Box>
          <Text className="text-lg text-white mt-5 mb-5">
            You might want to replace these cards:
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
        {firstCard && firstCard.alternatives && (
          <Box>
            <Text className="text-lg text-white mt-5 mb-5">
              by these cards:
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
        )}
      </Grid>
      <Text className="font-normal text-white text-center text-lg italic mt-6">
        Try these new card combinations in your next match!
      </Text>
    </Box>
  );
};

export default SoloCards;
