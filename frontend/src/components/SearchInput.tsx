import React, { useState } from 'react';
import { Box, Center, Input, InputGroup } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const SearchInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

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
        className="flex items-center justify-center my-7 mx-20"
      >
        <InputGroup justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'row'} w={'100%'} maxW={'500px'}>
            <Input
            id="combo-box-demo"
            placeholder="#Player tag"
            borderColor="gray.700"
            _hover={{ borderColor: 'primary' }}
            borderRadius="md"
            p={2}
            bg="transparent"
            color="white"
            fontStyle={'italic'}
            fontWeight={'normal'}
            fontSize={"lg"}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            textAlign={'center'}
            />
            {/* <InputRightElement children={<SearchIcon color="gray.300" />} /> */}
        </InputGroup>
      </MotionBox>
    </MotionBox>
  );
};

export default SearchInput;
