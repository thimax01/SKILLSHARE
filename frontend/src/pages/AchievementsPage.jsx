// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AchievementCard from '../components/AchievementCard';
// import AchievementForm from '../components/AchievementForm';
// import { useUser } from '../contexts/UserContext';

// const AchievementsPage = () => {
//   const [achievements, setAchievements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { currentUser } = useUser();

//   useEffect(() => {
//     fetchAchievements();
//   }, []);

//   const fetchAchievements = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.get('http://localhost:8081/api/achievements', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setAchievements(response.data);
//     } catch (err) {
//       console.error('Error fetching achievements:', err);
//       setError('Failed to load achievements');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAchievementCreated = (newAchievement) => {
//     setAchievements(prev => [newAchievement, ...prev]);
//   };

//   const handleAchievementDeleted = (achievementId) => {
//     setAchievements(prev => prev.filter(a => a.id !== achievementId));
//   };

//   const handleAchievementUpdated = (updatedAchievement) => {
//     setAchievements(prev => 
//       prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a)
//     );
//   };

//   if (loading) {
//     return (
//       <div className="max-w-2xl mx-auto mt-8 p-4">
//         <div className="animate-pulse space-y-4">
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-8 bg-gray-200 rounded"></div>
//           <div className="h-8 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-8 p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-white">Achievements</h1>
//       </div>

//       {currentUser && <AchievementForm onAchievementCreated={handleAchievementCreated} />}

//       {error && (
//         <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
//           <p className="text-red-500">{error}</p>
//         </div>
//       )}

//       <div className="space-y-4">
//         {achievements.map(achievement => (
//           <AchievementCard
//             key={achievement.id}
//             achievement={achievement}
//             onDelete={handleAchievementDeleted}
//             onUpdate={handleAchievementUpdated}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AchievementsPage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import AchievementCard from '../components/AchievementCard';
import AchievementForm from '../components/AchievementForm';
import { useUser } from '../contexts/UserContext';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUser();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    fetchAchievements();
    if (currentUser) {
      fetchCategories();
    }
  }, [currentUser]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.get('http://localhost:8081/api/achievements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAchievements(response.data);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/achievements/categories');
      if (Array.isArray(response.data)) {
        setCategories(response.data.filter(Boolean));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAchievementCreated = (newAchievement) => {
    setAchievements(prev => [newAchievement, ...prev]);
    
    if (newAchievement.category && !categories.includes(newAchievement.category)) {
      setCategories(prev => [...prev, newAchievement.category]);
    }
  };

  const handleAchievementDeleted = (achievementId) => {
    setAchievements(prev => prev.filter(a => a.id !== achievementId));
  };

  const handleAchievementUpdated = (updatedAchievement) => {
    setAchievements(prev => 
      prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a)
    );
    
    if (updatedAchievement.category && !categories.includes(updatedAchievement.category)) {
      setCategories(prev => [...prev, updatedAchievement.category]);
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-12 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-24 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4096FF] to-[#12B981]">
            Achievements
          </h1>
          <button 
            className="md:hidden px-3 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center space-x-1"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <span className="material-icons text-sm">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
        
        <p className="mt-2 text-gray-600">
          Showcase your professional milestones and personal growth
        </p>
      </div>

      {currentUser && <AchievementForm onAchievementCreated={handleAchievementCreated} />}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-red-500">error</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className={`md:flex md:space-x-4 ${showMobileFilter ? 'block' : 'hidden md:block'}`}>
        {/* Filters */}
        <div className="md:w-52 mb-6 md:mb-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-800 mb-3">Filter by Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                All Achievements
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1">
          {filteredAchievements.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-gray-400 mb-4">
                <span className="material-icons text-5xl">emoji_events</span>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No achievements found</h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory !== 'all' 
                  ? `There are no achievements in the ${selectedCategory} category yet.` 
                  : 'Start sharing your achievements with the community!'}
              </p>
              {currentUser && (
                <button 
                  onClick={() => document.getElementById('create-achievement')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white rounded-lg hover:from-[#3085EE] hover:to-[#0BA870] transition-colors"
                >
                  Create Your First Achievement
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onDelete={handleAchievementDeleted}
                  onUpdate={handleAchievementUpdated}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;

