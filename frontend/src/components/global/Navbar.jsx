import { useState, useContext, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { FaHouseUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { toast } from "react-toastify";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownOpen && 
        profileRef.current && 
        !profileRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  // Close mobile menu on route change
  const handleLinkClick = () => setMobileMenuOpen(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    toast.success("Logout successful");
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!currentUser) return "/user";
    
    switch (currentUser.role_id) {
      case 1: return "/admin";
      case 2: return "/doctor";
      default: return "/user";
    }
  };

  return (
    <header className="flex justify-center h-16 bg-white shadow-sm z-50 sticky top-0 text-gray-800 lg:h-20">
      <nav className="flex justify-between items-center w-full max-w-7xl px-4 md:px-6 lg:px-8 relative">
        {/* Logo */}
        <Link to="/" onClick={handleLinkClick} className="font-bold text-lg md:text-xl">
          AgroHealth&Services
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-8 font-medium">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/posts" className="hover:text-primary transition-colors">
                Post
              </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-primary transition-colors">
                Resources
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contacts
              </Link>
            </li>
            {currentUser && (
              <li>
                <Link
                  to={getDashboardLink()}
                  className="py-2 px-4 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Auth Buttons / User Profile */}
        <div className="hidden lg:flex items-center gap-4">
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 bg-primary rounded-full text-white font-medium hover:bg-opacity-90 transition-colors"
                aria-label="Open profile menu"
              >
                {currentUser?.name.charAt(0).toUpperCase()}
              </button>
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  ref={dropdownRef}
                  className="absolute top-12 right-0 w-64 bg-white rounded-md shadow-lg p-4 border flex flex-col gap-3"
                >
                  <div className="flex flex-col items-center gap-2 pb-2 border-b">
                    <div className="w-12 h-12 bg-primary rounded-full grid place-items-center text-white text-xl">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-lg">{currentUser?.name}</h3>
                    <p className="text-sm text-gray-600">{currentUser?.email}</p>
                  </div>
                  
                  <Link 
                    to={getDashboardLink()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
                  >
                    <FaHouseUser /> Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <IoLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signup">
                <button className="px-4 py-2 font-medium border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-2 bg-primary font-medium text-white rounded hover:bg-opacity-90 transition-colors">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg rounded-b-md z-50">
            <ul className="flex flex-col p-4 gap-4">
              <li>
                <Link to="/" onClick={handleLinkClick} className="block p-2 hover:bg-gray-100 rounded">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/posts" onClick={handleLinkClick} className="block p-2 hover:bg-gray-100 rounded">
                  Post
                </Link>
              </li>
              <li>
                <Link to="/resources" onClick={handleLinkClick} className="block p-2 hover:bg-gray-100 rounded">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleLinkClick} className="block p-2 hover:bg-gray-100 rounded">
                  Contacts
                </Link>
              </li>
              {currentUser && (
                <li>
                  <Link
                    to={getDashboardLink()}
                    onClick={handleLinkClick}
                    className="block p-2 bg-primary text-white rounded"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              
              {/* Mobile Auth Buttons */}
              {currentUser ? (
                <li className="mt-2 border-t pt-4">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 bg-primary rounded-full grid place-items-center text-white">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{currentUser.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link
                      to={getDashboardLink()}
                      onClick={handleLinkClick}
                      className="flex items-center justify-center gap-1 p-2 bg-primary text-white rounded text-sm"
                    >
                      <FaHouseUser /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded text-sm"
                    >
                      <IoLogOut /> Logout
                    </button>
                  </div>
                </li>
              ) : (
                <li className="mt-2 border-t pt-4 grid grid-cols-2 gap-2">
                  <Link 
                    to="/signup" 
                    onClick={handleLinkClick}
                    className="block text-center p-2 border border-primary text-primary rounded"
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={handleLinkClick}
                    className="block text-center p-2 bg-primary text-white rounded"
                  >
                    Log In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;