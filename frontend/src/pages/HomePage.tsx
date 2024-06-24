import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

const MotionBox = motion(Box);

const Home = () => {
  return (
    <>
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 110,
          delay: 0.2,
        }}
        className="flex items-center justify-center h-screen"
      >
        <h1 className="text-[2.5rem] font-bold text-center text-white">
          Discover the ultimate deck analysis to dominate Clash Royale! </h1>
      </MotionBox>
    </>
  );
};

export default Home;
