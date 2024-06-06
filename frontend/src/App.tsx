import FrostedHeader from "./components/FrostedHeader";
import SearchInput from "./components/SearchInput";

export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <FrostedHeader />
        <main>
          <SearchInput/>
        </main>
    </div>
  );
}