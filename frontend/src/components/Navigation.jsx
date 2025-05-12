// import { Link, useNavigate } from 'react-router-dom';
// import { useUser } from '../contexts/UserContext';
// import { useState } from 'react';
// import NotificationBell from './NotificationBell';

// const Navigation = () => {
//   const { currentUser, logout } = useUser();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   const handleLogout = async () => {
//     // Check if user was logged in with OAuth (Google)
//     const isOAuthUser = currentUser && currentUser.googleId;
    
//     if (isOAuthUser) {
//       try {
//         // First perform the regular logout
//         await logout();
        
//         // Then specifically target OAuth session
//         // For OAuth users, we need to:
//         // 1. Call a special endpoint to revoke the OAuth token if available
//         try {
//           await fetch('http://localhost:8081/logout', { 
//             method: 'POST',
//             credentials: 'include'  // Important to include cookies
//           });
//         } catch (e) {
//           console.log("Backend logout attempt:", e);
//         }
        
//         // 2. Clear all storage
//         localStorage.clear();
//         sessionStorage.clear();
        
//         // 3. Clear all cookies
//         document.cookie.split(";").forEach(cookie => {
//           const [name] = cookie.trim().split("=");
//           document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//           document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
//         });
        
//         // 4. Force a full page refresh and reset
//         setTimeout(() => {
//           window.location.href = '/login?logout=true&t=' + new Date().getTime();
//         }, 100);
//       } catch (error) {
//         console.error("Error during OAuth logout:", error);
//         // Fallback to force navigation
//         window.location.href = '/login';
//       }
//     } else {
//       // For regular users, use the standard flow
//       await logout();
//       navigate('/login');
//     }
//   };
  
//   return (
//     <nav className="bg-facebook-card border-b border-facebook-divider shadow-md fixed top-0 left-0 w-full z-50">
//       <div className="max-w-6xl mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <Link 
//               to="/" 
//               className="font-bold text-xl bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text"
//             >
//               CraftMind
//             </Link>
//           </div>
          
//           {currentUser ? (
//             <div className="flex items-center">
//               {/* Desktop Navigation */}
//               <div className="hidden md:flex items-center space-x-6">
//                 <Link 
//                   to="/" 
//                   className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
//                     window.location.pathname === '/' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
//                   }`}
//                 >
//                   Home
//                 </Link>
//                 <Link 
//                   to="/groups" 
//                   className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
//                     window.location.pathname === '/groups' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
//                   }`}
//                 >
//                   Groups
//                 </Link>
//                 <Link 
//                   to="/achievements" 
//                   className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
//                     window.location.pathname === '/achievements' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
//                   }`}
//                 >
//                   Achievements
//                 </Link>
//                 <Link 
//                   to="/profile" 
//                   className={`text-facebook-text-primary hover:text-facebook-primary transition duration-300 ${
//                     window.location.pathname === '/profile' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text' : ''
//                   }`}
//                 >
//                   Profile
//                 </Link>
                
//                 {/* Add NotificationBell here */}
//                 <NotificationBell />
                
//                 <div className="relative">
//                   <button 
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     className="flex items-center space-x-2 focus:outline-none text-facebook-text-primary hover:text-facebook-primary transition duration-300"
//                   >
//                     <span className="font-medium text-black">{currentUser.fullName || currentUser.username}</span>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
                  
//                   {isMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                       <Link 
//                         to="/profile" 
//                         onClick={() => setIsMenuOpen(false)}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         My Profile
//                       </Link>
//                       <Link 
//                         to="/notifications" 
//                         onClick={() => setIsMenuOpen(false)}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         All Notifications
//                       </Link>
//                       <button
//                         onClick={() => {
//                           setIsMenuOpen(false);
//                           handleLogout();
//                         }}
//                         className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-100"
//                       >
//                         Sign out
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Mobile Navigation */}
//               <div className="md:hidden flex items-center space-x-2">
//                 {/* Add NotificationBell for mobile */}
//                 <NotificationBell />
                
//                 <button 
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   className="flex items-center p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 </button>
                
//                 {isMenuOpen && (
//                   <div className="absolute right-0 left-0 mt-[43px] top-0 bg-white shadow-md py-2 z-10 text-gray-800">
//                     <Link 
//                       to="/" 
//                       onClick={() => setIsMenuOpen(false)}
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       Home
//                     </Link>
//                     <Link 
//                       to="/groups" 
//                       onClick={() => setIsMenuOpen(false)}
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       Groups
//                     </Link>
//                     <Link 
//                       to="/achievements" 
//                       onClick={() => setIsMenuOpen(false)}
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       Achievements
//                     </Link>
//                     <Link 
//                       to="/profile" 
//                       onClick={() => setIsMenuOpen(false)}
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       Profile
//                     </Link>
//                     <Link 
//                       to="/notifications" 
//                       onClick={() => setIsMenuOpen(false)}
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       Notifications
//                     </Link>
//                     <button
//                       onClick={() => {
//                         setIsMenuOpen(false);
//                         handleLogout();
//                       }}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="space-x-4">
//               <Link 
//                 to="/login" 
//                 className="py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
//               >
//                 Log In
//               </Link>
//               <Link 
//                 to="/register" 
//                 className="py-2 px-4 bg-white text-black font-medium rounded hover:bg-gray-100 transition duration-300"
//               >
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;


import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import { Home, Users, Award, User, LogOut, Bell, ChevronDown, Menu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    const isOAuthUser = currentUser && currentUser.googleId;
    
    if (isOAuthUser) {
      try {
        await logout();
        try {
          await fetch('http://localhost:8081/logout', { 
            method: 'POST',
            credentials: 'include'
          });
        } catch (e) {
          console.log("Backend logout attempt:", e);
        }
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach(cookie => {
          const [name] = cookie.trim().split("=");
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
        });
        setTimeout(() => {
          window.location.href = '/login?logout=true&t=' + new Date().getTime();
        }, 100);
      } catch (error) {
        console.error("Error during OAuth logout:", error);
        window.location.href = '/login';
      }
    } else {
      await logout();
      navigate('/login');
    }
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = window.location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`relative group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }`}
      >
        <Icon 
          size={20} 
          className={`transition-colors duration-300 ${
            isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'
          }`}
        />
        <span className="font-medium">{children}</span>
      </Link>
    );
  };
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-200 shadow-sm z-50"
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <Sparkles className="h-6 w-6 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
              SkillShare
            </span>
          </Link>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <NavLink to="/" icon={Home}>Home</NavLink>
                <NavLink to="/groups" icon={Users}>Groups</NavLink>
                <NavLink to="/achievements" icon={Award}>Achievements</NavLink>
                <NavLink to="/profile" icon={User}>Profile</NavLink>
                
                <NotificationBell />
                
                <motion.div className="relative">
                  <motion.button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                      {currentUser.fullName?.[0] || currentUser.username?.[0] || 'U'}
                    </div>
                    <span className="font-medium text-gray-700">
                      {currentUser.fullName || currentUser.username}
                    </span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100"
                      >
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User size={16} className="mr-2 text-gray-400" />
                          My Profile
                        </Link>
                        <Link 
                          to="/notifications" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Bell size={16} className="mr-2 text-gray-400" />
                          All Notifications
                        </Link>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut size={16} className="mr-2 text-red-400" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              <div className="md:hidden flex items-center">
                <NotificationBell />
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 ml-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Menu size={24} className="text-gray-600" />
                </button>
                
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-20 left-0 right-0 bg-white shadow-lg border-t border-gray-100"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                            {currentUser.fullName?.[0] || currentUser.username?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {currentUser.fullName || currentUser.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {currentUser.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link 
                          to="/" 
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Home size={20} className="mr-3 text-gray-400" />
                          Home
                        </Link>
                        <Link 
                          to="/groups" 
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Users size={20} className="mr-3 text-gray-400" />
                          Groups
                        </Link>
                        <Link 
                          to="/achievements" 
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Award size={20} className="mr-3 text-gray-400" />
                          Achievements
                        </Link>
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User size={20} className="mr-3 text-gray-400" />
                          Profile
                        </Link>
                        <div className="my-2 border-t border-gray-100" />
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={20} className="mr-3 text-red-400" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="space-x-3">
              <Link 
                to="/login" 
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;