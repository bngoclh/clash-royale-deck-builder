import FrostedHeader from "./components/FrostedHeader";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BattleLog from "./pages/BattleLog";
import { ChakraProvider } from "@chakra-ui/react";



export default function App() {
  return (
    <ChakraProvider>
    <div className="bg-gray-900 min-h-screen">
      <FrostedHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/battle-log" element={<BattleLog />} />
       </Routes>
    </div>
    </ChakraProvider> 
  );
}



// export default function App() {
//   return (
//     <div className="bg-gray-900 min-h-screen">
//       <FrostedHeader />
//         <main>
//           <BattleLog />
//         </main>
//     </div>
//   );
// }



