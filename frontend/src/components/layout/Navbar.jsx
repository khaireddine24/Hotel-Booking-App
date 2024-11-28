import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Building2, 
  Settings, 
  LogIn, 
  LogOut, 
  User, 
  Hotel,
  ChevronDown,
  User2
} from 'lucide-react';
import { AuthContext } from '../../auth/AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(AuthContext);
  
  const isLoggedIn = user !== null;
  const userRole = localStorage.getItem("userRole");

  console.log(user,'---',isLoggedIn,'----',userRole);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Common link styles with active state
  const getLinkClasses = (path) => {
    return `text-gray-600 hover:text-gray-900 flex items-center gap-2 ${
      isActive(path) ? 'bg-purple-500 text-white rounded-md px-2 py-1' : ''
    }`;
  };

  // Mobile link styles with active state
  const getMobileLinkClasses = (path) => {
    return `flex items-center gap-2 px-3 py-2 rounded-md ${
      isActive(path) 
        ? 'bg-purple-500 text-white' 
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40 h-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-gray-800 text-lg font-bold flex items-center gap-2 mr-5">
              <Hotel className="h-6 w-6" />
              <span className="text-xl font-bold text-gray-800">HotelBooking</span>
            </Link>
            {isLoggedIn && userRole === "ROLE_ADMIN" && (
              <Link
                to={'/Admin'}
                className={getLinkClasses('/Admin')}
              >
                <User2 className='h-5 w-5'/>
                <span>Admin</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to={'/all-rooms'} 
              className={getLinkClasses('/all-rooms')}
            >
              <Search className="h-5 w-5" />
              <span>Browse all rooms</span>
            </Link>
            
            <Link 
              to={'/find-booking'} 
              className={getLinkClasses('/bookings')}
            >
              <Settings className="h-5 w-5" />
              <span>Find my booking</span>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <User className="h-5 w-5" />
                <span>Account</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  role="menu"
                >
                  {isLoggedIn ? (
                    <>
                      <Link 
                        to="/profile" 
                        className={`flex items-center gap-2 px-4 py-2 ${
                          isActive('/profile') ? 'bg-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <button 
                        onClick={handleLogoutClick}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      className={`flex items-center gap-2 px-4 py-2 ${
                        isActive('/login') ? 'bg-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to={'/all-rooms'}
              className={getMobileLinkClasses('/all-rooms')}
              onClick={() => setIsOpen(false)}
            >
              <Search className="h-5 w-5" />
              <span>Browse all rooms</span>
            </Link>
            
            <Link 
              to={'/manage-rooms'}
              className={getMobileLinkClasses('/manage-rooms')}
              onClick={() => setIsOpen(false)}
            >
              <Building2 className="h-5 w-5" />
              <span>Manage rooms</span>
            </Link>
            
            <Link 
              to={'/find-booking'}
              className={getMobileLinkClasses('/bookings')}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Find my booking</span>
            </Link>
            
            {!isLoggedIn && (
              <Link 
                to="/login"
                className={getMobileLinkClasses('/login')}
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
            
            {isLoggedIn && (
              <>
                <Link 
                  to="/profile"
                  className={getMobileLinkClasses('/profile')}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                
                <button 
                  onClick={handleLogoutClick}
                  className={`w-full text-left ${getMobileLinkClasses('/logout')}`}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;