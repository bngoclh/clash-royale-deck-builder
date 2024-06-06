import { BrowserRouter as Router, Link } from 'react-router-dom';

const FrostedHeader: React.FC = () => {
  return (
    <Router>
    <nav className="top-0 z-10 sticky border-b border-gray-800 bg-transparent backdrop-blur-sm">
      <div className="flex justify-around p-5 w-full mx-auto">
        <div className="flex items-center">
          {/* Logo */}
            <span className="text-white text-xl ml-1">
              CR project
            </span>
        </div>


          {/* Navigation Links */}
          <div className="flex space-x-10">
            <Link to="/" className="text-white text-xl hover:text-violet-500 transition duration-100">
              Home
            </Link>
            <Link to="/battle-log" className="text-white text-xl hover:text-violet-500 transition duration-100">
              Battle Log
            </Link>
            <Link to="/deck-builder" className="text-white text-xl hover:text-violet-500 transition duration-100">
              Deck Builder
            </Link>
          </div>
        </div>
      </nav>
    </Router>
  );
};

export default FrostedHeader;
