import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

const Navigation = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    // Check if user was logged in with OAuth (Google)
    const isOAuthUser = currentUser && currentUser.googleId;
    
    if (isOAuthUser) {
      try {
        // First perform the regular logout
        await logout();
        
        // Then specifically target OAuth session
        // For OAuth users, we need to:
        // 1. Call a special endpoint to revoke the OAuth token if available
        try {
          await fetch('http://localhost:8081/logout', { 
            method: 'POST',
            credentials: 'include'  // Important to include cookies
          });
        } catch (e) {
          console.log("Backend logout attempt:", e);
        }
        
        // 2. Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // 3. Clear all cookies
        document.cookie.split(";").forEach(cookie => {
          const [name] = cookie.trim().split("=");
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
        });
        
        // 4. Force a full page refresh and reset
        setTimeout(() => {
          window.location.href = '/login?logout=true&t=' + new Date().getTime();
        }, 100);
      } catch (error) {
        console.error("Error during OAuth logout:", error);
        // Fallback to force navigation
        window.location.href = '/login';
      }
    } else {
      // For regular users, use the standard flow
      await logout();
      navigate('/login');
    }
  };
  
  return (
    <nav className="bg-facebook-card border-b border-facebook-divider shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="font-bold text-xl bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text"
            >
              CraftMind
            </Link>
          </div>
          
          {currentUser ? (
            <div className="flex items-center">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
                    window.location.pathname === '/' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/groups" 
                  className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
                    window.location.pathname === '/groups' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
                  }`}
                >
                  Groups
                </Link>
                <Link 
                  to="/achievements" 
                  className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
                    window.location.pathname === '/achievements' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
                  }`}
                >
                  Achievements
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
                    window.location.pathname === '/profile' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
                  }`}
                >
                  Profile
                </Link>
                
                {/* Add NotificationBell here */}
                <NotificationBell />
                
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none text-facebook-text-primary hover:text-facebook-primary transition duration-300"
                  >
                    <span className="font-medium text-black">{currentUser.fullName || currentUser.username}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/notifications" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        All Notifications
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center space-x-2">
                {/* Add NotificationBell for mobile */}
                <NotificationBell />
                
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 left-0 mt-[43px] top-0 bg-white shadow-md py-2 z-10 text-gray-800">
                    <Link 
                      to="/" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Home
                    </Link>
                    <Link 
                      to="/groups" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Groups
                    </Link>
                    <Link 
                      to="/achievements" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Achievements
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/notifications" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Notifications
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                to="/login" 
                className="py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="py-2 px-4 bg-white text-black font-medium rounded hover:bg-gray-100 transition duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
