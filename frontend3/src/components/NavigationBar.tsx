// components/FrostedNavBar.tsx
import Link from 'next/link';

const NavBar: React.FC = () => {
  return (
    <nav className="top-0 z-10 sticky border-b border-gray-800 bg-transparent backdrop-blur-sm">
      <div className="flex justify-around p-5 w-full mx-auto">
      <div className="flex items-center">
        {/* Logo */}
          <span className="text-white text-xl ml-2">
            CR project
            </span>
      </div>

        <div className="flex space-x-10">
          <Link href="/" className="text-white text-xl hover:text-violet-500 transition duration-100">
              Home
          </Link>
          <Link href="/deck-builder" className="text-white text-xl hover:text-violet-500 transition duration-100">
              Battle Log
          </Link>
          <Link href="/deck-analysis" className="text-white text-xl hover:text-violet-500 transition duration-100">
              Deck Builder
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
