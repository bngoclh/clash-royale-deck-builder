import { useState } from 'react';
import { Box, Input, InputGroup } from '@chakra-ui/react';
import { Button,  } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { IoSearchOutline } from "react-icons/io5";
import API from '../API-client';


const MotionBox = motion(Box);

const SearchInput = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const HandleSearchBattleLog =() => {
    if (inputValue !== '') {
      API  // call the getBattleLog function from the API-client.ts file 
      .getMostUsedDeck(inputValue)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      alert('Please enter a player tag');
  };
}
  
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
      Search for battle logs
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 110,
          delay: 0.3,
        }}
        className="flex flex-col items-center justify-center my-7 mx-20"
      >
        <InputGroup justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'} w={'100%'} maxW={'300px'} maxH={'20px'}>
            <Input
            colorScheme='purple'
            id="combo-box-demo"
            placeholder="#Player tag"
            borderColor="white"
            borderRadius="md"
            p={7}
            bg="transparent"
            color="white"
            fontStyle={'italic'}
            fontWeight={'normal'}
            fontSize={'1.5rem'}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            textAlign={'center'}
            />
        </InputGroup>

        <Button
          leftIcon={<IoSearchOutline />} colorScheme="purple" variant="solid" size="lg" mt={10}
          onClick={HandleSearchBattleLog}
          >
            Search
        </Button>
      </MotionBox>
    </MotionBox>
  );
};

export default SearchInput;
