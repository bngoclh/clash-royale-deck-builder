import { Link, useNavigate } from 'react-router-dom';

const FrostedHeader = () => {
  const navigate = useNavigate();
  const activePath = window.location.pathname;

  return (
    <>
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
            {/*Check if the current active path (activePath) is equal to the path we are on right now*/}
            <Link to="/" className={activePath === "/" ? "text-purple-500 text-xl" : "text-white text-xl hover:text-purple-500 transition duration-100"}>
              Home
            </Link>
            <Link to="/battle-log" className={activePath === '/battle-log' ? "text-purple-500 text-xl hover:text-purple-500 transition duration-100" : "text-white text-xl hover:text-purple-500 transition duration-100"}>
              Battle Log
            </Link>
            <Link to="/deck-builder" className={activePath === '/deck-builder' ? "text-purple-500 text-xl hover:text-purple-500 transition duration-100" : "text-white text-xl hover:text-purple-500 transition duration-100"}>
              Deck Builder
            </Link>
          </div>
        </div>
      </nav>
      </>
  );
};

export default FrostedHeader;
