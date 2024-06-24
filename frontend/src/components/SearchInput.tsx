import { useState } from "react";
import { Box, Input, InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import API from "../API-client";
import ResultGrid from "./ResultGrid";

const MotionBox = motion(Box);

const SearchInput = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [results, setResults] = useState(null); // [playerTag, playerName, elixir, count, cardNames

  const HandleSearchBattleLog = () => {
    if (inputValue !== "") {
      API.getMostUsedDeck(inputValue) // call the getBattleLog function from the API-client.ts file
        .then((response) => {
          // console.log(response.data);
          const playerName = response.data.playerName;
          const elixir = response.data.elixir;
          const count = response.data.count;
          const cardNames = response.data.cards.map((card: any) => card.name);
          const winRate = response.data.winRate;
          const trophyChanges = response.data.trophyChanges;
          const numberOfBattles = response.data.numberOfBattles;
          const soloCards = response.data.soloCards.map((card: any) => ({
            cardName: card.cardName,
            alternatives: card.alternatives,
          }));
          const winningOpponents = response.data.WinningOpponents.map(
            (opponent: any) => ({
              opponentName: opponent.opponentName,
              opponentDeck: opponent.opponentDeck.map((card: any) => ({
                name: card.name,
                elixirCost: card.elixirCost,
                rarity: card.rarity,
              })),
            })
          );
          // Create an object with the data we need
          const resultData = {
            playerName,
            elixir,
            count,
            cardNames,
            winRate,
            trophyChanges,
            numberOfBattles,
            soloCards,
            winningOpponents,
          };
          setResults(resultData); // Save the results in state
          // console.log(resultData.winRate);
          console.log(resultData.winningOpponents);

          // Add your API.postBattleLog call here
          API.postBattleLog(inputValue)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please enter a player tag");
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 110,
        delay: 0.2,
      }}
      className="my-8 max-w-6xl w-11/12 mx-auto sm:my-10 text-[2.5rem] font-bold text-center text-white"
    >
      See your most used deck analysis
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 110,
          delay: 0.3,
        }}
        className="flex flex-col items-center justify-center my-7 mx-1" //chỉnh thụt lề trái phải ở đ
      >
        <InputGroup
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
          w={"100%"}
          maxW={"300px"}
          maxH={"20px"}
        >
          <Input
            colorScheme="purple"
            id="combo-box-demo"
            placeholder="#Player tag"
            borderColor="white"
            borderRadius="md"
            p={7}
            bg="transparent"
            color="white"
            fontStyle={"italic"}
            fontWeight={"normal"}
            fontSize={"1.5rem"}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            textAlign={"center"}
          />
        </InputGroup>
        <Button
          leftIcon={<IoSearchOutline />}
          colorScheme="purple"
          variant="solid"
          size="lg"
          mt={10}
          onClick={HandleSearchBattleLog}
        >
          Search
        </Button>
        {results && <ResultGrid results={results} />}{" "}
        {/* Conditionally render the ResultGrid component with the results as a prop */}
      </MotionBox>
    </MotionBox>
  );
};

export default SearchInput;
