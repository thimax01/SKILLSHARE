// import { useState, useEffect } from 'react';
// import { useUser } from '../contexts/UserContext';
// import axios from 'axios';
// import FollowButton from '../components/FollowButton';
// import AchievementCard from '../components/AchievementCard';
// import PostCard from '../components/PostCard';
// import AchievementForm from '../components/AchievementForm';
// import Alert from '../components/Alert';

// const ProfilePage = () => {
//   const { currentUser, updateUser } = useUser();
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     username: '',
//     bio: '',
//     specializations: [],
//     role: ''
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [userPosts, setUserPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
//   const [followerCount, setFollowerCount] = useState(0);
//   const [followingCount, setFollowingCount] = useState(0);
//   const [achievementsByCategory, setAchievementsByCategory] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [activeTab, setActiveTab] = useState('posts');
//   const [achievements, setAchievements] = useState([]);

//   useEffect(() => {
//     if (currentUser) {
//       setFormData({
//         fullName: currentUser.fullName || '',
//         email: currentUser.email || '',
//         username: currentUser.username || '',
//         bio: currentUser.bio || '',
//         specializations: currentUser.specializations || [],
//         role: currentUser.role || 'LEARNER'
//       });
      
//       const fetchUserPosts = async () => {
//         try {
//           setIsLoading(true);
//           const response = await axios.get(`http://localhost:8081/api/posts/user/${currentUser.id}`);
//           if (response.data) {
//             setUserPosts(response.data);
//           }
//         } catch (error) {
//           console.error('Error fetching user posts:', error);
//           setMessage({ 
//             type: 'error', 
//             text: 'Failed to load posts. Please try again.' 
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       };
      
//       fetchUserPosts();
//       fetchFollowStats();
//       fetchAchievementCategories();
//     }
//   }, [currentUser]);
  
//   const fetchFollowStats = async () => {
//     try {
//       const [followersRes, followingRes, countsRes] = await Promise.all([
//         axios.get(`http://localhost:8081/api/users/${currentUser.id}/followers`),
//         axios.get(`http://localhost:8081/api/users/${currentUser.id}/following`),
//         axios.get(`http://localhost:8081/api/users/${currentUser.id}/counts`)
//       ]);
      
//       setFollowers(followersRes.data);
//       setFollowing(followingRes.data);
//       setFollowerCount(countsRes.data.followers);
//       setFollowingCount(countsRes.data.following);
//     } catch (error) {
//       console.error('Error fetching follow stats:', error);
//     }
//   };

//   const refreshFollowCounts = async () => {
//     try {
//       const countsRes = await axios.get(`http://localhost:8081/api/users/${currentUser.id}/counts`);
//       setFollowerCount(countsRes.data.followers);
//       setFollowingCount(countsRes.data.following);
//       fetchFollowStats();
//     } catch (error) {
//       console.error('Error refreshing counts:', error);
//     }
//   };

//   const fetchAchievementCategories = async () => {
//     try {
//       const categoriesRes = await axios.get(`http://localhost:8081/api/users/${currentUser.id}/achievements/categories`);
      
//       if (!Array.isArray(categoriesRes.data)) {
//         console.error('Categories response is not an array:', categoriesRes.data);
//         return;
//       }

//       const uniqueCategories = [...new Set(categoriesRes.data)].filter(Boolean);
//       setCategories(uniqueCategories);

//       const allPromises = uniqueCategories.map(async (category) => {
//         const response = await axios.get(
//           `http://localhost:8081/api/users/${currentUser.id}/achievements/category/${category}`
//         );
//         return { category, achievements: response.data };
//       });

//       const allAchievementsRes = await axios.get(
//         `http://localhost:8081/api/users/${currentUser.id}/achievements/latest`
//       );
//       setAchievements(allAchievementsRes.data);

//       const categoryResults = await Promise.all(allPromises);
      
//       const achievementsMap = {};
//       categoryResults.forEach(({ category, achievements }) => {
//         achievementsMap[category] = achievements;
//       });

//       setAchievementsByCategory(achievementsMap);

//     } catch (error) {
//       console.error('Error fetching achievement categories:', error);
//       setMessage({ 
//         type: 'error', 
//         text: 'Failed to load achievements. Please try again.' 
//       });
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage({ type: '', text: '' });
    
//     try {
//       const response = await axios.put(`http://localhost:8081/api/users/${currentUser.id}`, formData);
      
//       updateUser({
//         ...currentUser,
//         ...response.data,
//       });
      
//       setMessage({ 
//         type: 'success', 
//         text: 'Profile updated successfully!' 
//       });
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setMessage({ 
//         type: 'error', 
//         text: error.response?.data?.error || 'Failed to update profile' 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (currentUser) {
//       fetchUserContent();
//     }
//   }, [currentUser]);

//   const handlePostDeleted = (postId) => {
//     setUserPosts(prev => prev.filter(post => post.id !== postId));
//   };

//   const handlePostUpdated = (updatedPost) => {
//     setUserPosts(prev => prev.map(post => 
//       post.id === updatedPost.id ? updatedPost : post
//     ));
//   };

//   const handleAchievementCreated = (newAchievement) => {
//     setAchievements(prev => [newAchievement, ...prev]);

//     if (newAchievement.category) {
//       setAchievementsByCategory(prev => {
//         const updated = { ...prev };
//         if (!updated[newAchievement.category]) {
//           updated[newAchievement.category] = [];
//         }
//         updated[newAchievement.category] = [
//           newAchievement,
//           ...(updated[newAchievement.category] || [])
//         ];
//         return updated;
//       });

//       setCategories(prev => {
//         if (!prev.includes(newAchievement.category)) {
//           return [...prev, newAchievement.category];
//         }
//         return prev;
//       });
//     }
//   };

//   const fetchUserContent = async () => {
//     setIsLoading(true);
//     try {
//       const [postsRes] = await Promise.all([
//         axios.get(`http://localhost:8081/api/posts/user/${currentUser.id}`)
//       ]);

//       setUserPosts(postsRes.data);
//       await fetchAchievementCategories();
//     } catch (error) {
//       console.error('Error fetching user content:', error);
//       setMessage({ type: 'error', text: 'Failed to load content' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getVideoId = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const handleSpecializationsChange = (value) => {
//     setFormData({
//       ...formData,
//       specializations: value.split(',').map(s => s.trim()).filter(s => s)
//     });
//   };

//   const handleAchievementDeleted = async (achievementId) => {
//     try {
//       setAchievements(prev => prev.filter(a => a.id !== achievementId));
      
//       setAchievementsByCategory(prev => {
//         const updated = { ...prev };
//         Object.keys(updated).forEach(category => {
//           updated[category] = updated[category].filter(a => a.id !== achievementId);
//         });
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error handling achievement deletion:', error);
//       setMessage({
//         type: 'error',
//         text: 'Failed to update achievements list'
//       });
//     }
//   };

//   const handleAchievementUpdated = async (updatedAchievement) => {
//     try {
//       setAchievements(prev => 
//         prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a)
//       );
      
//       setAchievementsByCategory(prev => {
//         const updated = { ...prev };
//         Object.keys(updated).forEach(category => {
//           updated[category] = updated[category].map(a => 
//             a.id === updatedAchievement.id ? updatedAchievement : a
//           );
//         });
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error handling achievement update:', error);
//       setMessage({
//         type: 'error',
//         text: 'Failed to update achievement'
//       });
//     }
//   };

//   const renderTabs = () => (
//     <div className="flex border-b">
//       <span
//         onClick={() => setActiveTab('posts')}
//         className={`px-6 py-3 cursor-pointer ${
//           activeTab === 'posts'
//             ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold'
//             : 'text-gray-500'
//         }`}
//       >
//         My Posts
//       </span>
//       <span
//         onClick={() => setActiveTab('achievements')}
//         className={`px-6 py-3 cursor-pointer ${
//           activeTab === 'achievements'
//             ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold'
//             : 'text-gray-500'
//         }`}
//       >
//         My Achievements
//       </span>
//     </div>
//   );

//   const renderContent = () => {
//     if (isLoading) return <div className="text-center py-4">Loading...</div>;

//     switch(activeTab) {
//       case 'posts':
//         return (
//           <div className="space-y-4">
//             {userPosts.map(post => (
//               <PostCard 
//                 key={post.id} 
//                 post={post}
//                 userId={currentUser?.id}
//                 onDelete={handlePostDeleted}
//                 onUpdate={handlePostUpdated}
//               />
//             ))}
//           </div>
//         );
//       case 'achievements':
//         return (
//           <div>
//             <div className="flex gap-2 mb-4 overflow-x-auto">
//               <button
//                 onClick={() => setSelectedCategory('all')}
//                 className={`px-4 py-2 rounded-lg whitespace-nowrap ${
//                   selectedCategory === 'all' 
//                     ? 'bg-facebook-primary text-white' 
//                     : 'bg-facebook-card text-facebook-text-primary'
//                 }`}
//               >
//                 All
//               </button>
//               {categories.map(category => (
//                 <button
//                   key={category}
//                   onClick={() => setSelectedCategory(category)}
//                   className={`px-4 py-2 rounded-lg whitespace-nowrap ${
//                     selectedCategory === category 
//                       ? 'bg-facebook-primary text-white' 
//                       : 'bg-facebook-card text-facebook-text-primary'
//                   }`}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//             <AchievementForm onAchievementCreated={handleAchievementCreated} />
//             <div className="mt-4 space-y-4">
//               {selectedCategory === 'all' ? (
//                 achievements.length > 0 ? (
//                   achievements.map(achievement => (
//                     <AchievementCard
//                       key={achievement.id}
//                       achievement={achievement}
//                       onDelete={handleAchievementDeleted}
//                       onUpdate={handleAchievementUpdated}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-500">No achievements yet</p>
//                 )
//               ) : (
//                 (achievementsByCategory[selectedCategory]?.length > 0 ? (
//                   achievementsByCategory[selectedCategory].map(achievement => (
//                     <AchievementCard
//                       key={achievement.id}
//                       achievement={achievement}
//                       onDelete={handleAchievementDeleted}
//                       onUpdate={handleAchievementUpdated}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-500">No achievements in this category</p>
//                 ))
//               )}
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto max-w-4xl px-4 py-8">
//       <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden mb-8 text-gray-800 border border-gray-200">
//         <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 py-8 text-white relative">
//           <div className="flex items-center space-x-4">
//             <div className="w-20 h-20 bg-facebook-card rounded-full flex items-center justify-center text-facebook-primary text-2xl font-bold border-4 border-white">
//               {currentUser?.fullName?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase()}
//             </div>
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 space-y-4 md:space-y-0 md:space-x-8">
//               <div>
//                 <h1 className="text-3xl font-bold text-white">{currentUser?.fullName || currentUser?.username}</h1>
//                 <p className="text-white/80">@{currentUser?.username}</p>
//               </div>

//               <div className="flex space-x-8">
//                 <div
//                   onClick={() => setShowFollowers(true)}
//                   className="text-white hover:text-gray-200 flex flex-row items-center cursor-pointer space-x-2"
//                 >
//                   <span className="text-2xl font-bold">{followerCount}</span>
//                   <span className="text-sm">Followers</span>
//                 </div>

//                 <div
//                   onClick={() => setShowFollowing(true)}
//                   className="text-white hover:text-gray-200 flex flex-row items-center cursor-pointer space-x-2"
//                 >
//                   <span className="text-2xl font-bold">{followingCount}</span>
//                   <span className="text-sm">Following</span>
//                 </div>
//               </div>
//             </div>
//             </div>
//         </div>
        
//         <div className="p-6">
//           {currentUser?.role === 'INSTRUCTOR' && currentUser?.isVerified && (
//             <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//               Verified Instructor
//             </div>
//           )}
//           {message.text && (
//             <Alert
//               type={message.type === 'error' ? 'error' : 'success'}
//               message={message.text}
//               onClose={() => setMessage({ text: '', type: '' })}
//             />
//           )}
          
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="username">
//                   Username
//                 </label>
//                 <input
//                   className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-600"
//                   id="username"
//                   name="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={handleChange}
//                   disabled={!isEditing || isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
//                   Email Address
//                 </label>
//                 <input
//                   className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-600"
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={!isEditing || isLoading}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="fullName">
//                   Full Name
//                 </label>
//                 <input
//                   className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-600"
//                   id="fullName"
//                   name="fullName"
//                   type="text"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   disabled={!isEditing || isLoading}
//                 />
//               </div>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-800 text-sm font-bold mb-2">
//                 Role
//               </label>
//               <input
//                 className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
//                 value={currentUser?.role}
//                 disabled
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="bio">
//                 Bio
//               </label>
//               <textarea
//                 className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//                 id="bio"
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 rows="3"
//               />
//             </div>

//             {currentUser?.role === 'INSTRUCTOR' && (
//               <div className="mb-4">
//                 <label className="block text-gray-800 text-sm font-bold mb-2">
//                   Specializations
//                 </label>
//                 <input
//                   type="text"
//                   className="appearance-none border-2 border-gray-300 bg-white rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:border-indigo-500"
//                   value={formData.specializations.join(', ')}
//                   onChange={(e) => handleSpecializationsChange(e.target.value)}
//                   disabled={!isEditing}
//                 />
//               </div>
//             )}
            
//             <div className="mt-8 flex justify-end">
//               {isEditing ? (
//                 <>
//                   <button
//                     type="button"
//                     className="mr-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setFormData({
//                         fullName: currentUser.fullName || '',
//                         email: currentUser.email || '',
//                         username: currentUser.username || '',
//                         bio: currentUser.bio || '',
//                         specializations: currentUser.specializations || [],
//                         role: currentUser.role || 'LEARNER'
//                       });
//                     }}
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ${
//                       isLoading ? 'opacity-70 cursor-not-allowed' : ''
//                     }`}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Saving...' : 'Save Changes'}
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   type="button"
//                   className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
//                   onClick={() => setIsEditing(true)}
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
      
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
//         {renderTabs()}
//         <div className="p-6">
//           {renderContent()}
//         </div>
//       </div>

//       {showFollowers && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-md">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h3 className="text-lg font-medium">Followers</h3>
//               <button 
//                 onClick={() => setShowFollowers(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-4 max-h-96 overflow-y-auto">
//               {followers.length > 0 ? (
//                 followers.map(user => (
//                   <div key={user.id} className="flex items-center justify-between py-2 border-b">
//                     <div>
//                       <p className="font-medium">{user.username}</p>
//                       <p className="text-sm text-gray-500">{user.fullName}</p>
//                     </div>
//                     <FollowButton userId={user.id} followerId={currentUser.id} onRefreshCounts={refreshFollowCounts} />
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 py-4">No followers yet</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {showFollowing && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-md">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h3 className="text-lg font-medium">Following</h3>
//               <button 
//                 onClick={() => setShowFollowing(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-4 max-h-96 overflow-y-auto">
//               {following.length > 0 ? (
//                 following.map(user => (
//                   <div key={user.id} className="flex items-center justify-between py-2 border-b">
//                     <div>
//                       <p className="font-medium">{user.username}</p>
//                       <p className="text-sm text-gray-500">{user.fullName}</p>
//                     </div>
//                     <FollowButton 
//                       userId={user.id} 
//                       followerId={currentUser.id} 
//                       onRefreshCounts={refreshFollowCounts}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 py-4">Not following anyone yet</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;





import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import FollowButton from '../components/FollowButton';
import AchievementCard from '../components/AchievementCard';
import PostCard from '../components/PostCard';
import AchievementForm from '../components/AchievementForm';
import Alert from '../components/Alert';

const ProfilePage = () => {
  const { currentUser, updateUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    specializations: [],
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [achievementsByCategory, setAchievementsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('posts');
  const [achievements, setAchievements] = useState([]);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        specializations: currentUser.specializations || [],
        role: currentUser.role || 'LEARNER'
      });
      
      const fetchUserPosts = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:8081/api/posts/user/${currentUser.id}`);
          if (response.data) {
            setUserPosts(response.data);
          }
        } catch (error) {
          console.error('Error fetching user posts:', error);
          setMessage({ 
            type: 'error', 
            text: 'Failed to load posts. Please try again.' 
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserPosts();
      fetchFollowStats();
      fetchAchievementCategories();
    }
  }, [currentUser]);
  
  const fetchFollowStats = async () => {
    try {
      const [followersRes, followingRes, countsRes] = await Promise.all([
        axios.get(`http://localhost:8081/api/users/${currentUser.id}/followers`),
        axios.get(`http://localhost:8081/api/users/${currentUser.id}/following`),
        axios.get(`http://localhost:8081/api/users/${currentUser.id}/counts`)
      ]);
      
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
      setFollowerCount(countsRes.data.followers);
      setFollowingCount(countsRes.data.following);
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  const refreshFollowCounts = async () => {
    try {
      const countsRes = await axios.get(`http://localhost:8081/api/users/${currentUser.id}/counts`);
      setFollowerCount(countsRes.data.followers);
      setFollowingCount(countsRes.data.following);
      fetchFollowStats();
    } catch (error) {
      console.error('Error refreshing counts:', error);
    }
  };

  const fetchAchievementCategories = async () => {
    try {
      const categoriesRes = await axios.get(`http://localhost:8081/api/users/${currentUser.id}/achievements/categories`);
      
      if (!Array.isArray(categoriesRes.data)) {
        console.error('Categories response is not an array:', categoriesRes.data);
        return;
      }

      const uniqueCategories = [...new Set(categoriesRes.data)].filter(Boolean);
      setCategories(uniqueCategories);

      const allPromises = uniqueCategories.map(async (category) => {
        const response = await axios.get(
          `http://localhost:8081/api/users/${currentUser.id}/achievements/category/${category}`
        );
        return { category, achievements: response.data };
      });

      const allAchievementsRes = await axios.get(
        `http://localhost:8081/api/users/${currentUser.id}/achievements/latest`
      );
      setAchievements(allAchievementsRes.data);

      const categoryResults = await Promise.all(allPromises);
      
      const achievementsMap = {};
      categoryResults.forEach(({ category, achievements }) => {
        achievementsMap[category] = achievements;
      });

      setAchievementsByCategory(achievementsMap);

    } catch (error) {
      console.error('Error fetching achievement categories:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load achievements. Please try again.' 
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put(`http://localhost:8081/api/users/${currentUser.id}`, formData);
      
      updateUser({
        ...currentUser,
        ...response.data,
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update profile' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserContent();
    }
  }, [currentUser]);

  const handlePostDeleted = (postId) => {
    setUserPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setUserPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleAchievementCreated = (newAchievement) => {
    setAchievements(prev => [newAchievement, ...prev]);

    if (newAchievement.category) {
      setAchievementsByCategory(prev => {
        const updated = { ...prev };
        if (!updated[newAchievement.category]) {
          updated[newAchievement.category] = [];
        }
        updated[newAchievement.category] = [
          newAchievement,
          ...(updated[newAchievement.category] || [])
        ];
        return updated;
      });

      setCategories(prev => {
        if (!prev.includes(newAchievement.category)) {
          return [...prev, newAchievement.category];
        }
        return prev;
      });
    }
  };

  const fetchUserContent = async () => {
    setIsLoading(true);
    try {
      const [postsRes] = await Promise.all([
        axios.get(`http://localhost:8081/api/posts/user/${currentUser.id}`)
      ]);

      setUserPosts(postsRes.data);
      await fetchAchievementCategories();
    } catch (error) {
      console.error('Error fetching user content:', error);
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setIsLoading(false);
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSpecializationsChange = (value) => {
    setFormData({
      ...formData,
      specializations: value.split(',').map(s => s.trim()).filter(s => s)
    });
  };

  const handleAchievementDeleted = async (achievementId) => {
    try {
      setAchievements(prev => prev.filter(a => a.id !== achievementId));
      
      setAchievementsByCategory(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(category => {
          updated[category] = updated[category].filter(a => a.id !== achievementId);
        });
        return updated;
      });
    } catch (error) {
      console.error('Error handling achievement deletion:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update achievements list'
      });
    }
  };

  const handleAchievementUpdated = async (updatedAchievement) => {
    try {
      setAchievements(prev => 
        prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a)
      );
      
      setAchievementsByCategory(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(category => {
          updated[category] = updated[category].map(a => 
            a.id === updatedAchievement.id ? updatedAchievement : a
          );
        });
        return updated;
      });
    } catch (error) {
      console.error('Error handling achievement update:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update achievement'
      });
    }
  };

  const renderTabs = () => (
    <div className="flex border-b">
      <button
        onClick={() => setActiveTab('posts')}
        className={`px-6 py-3 transition-colors ${
          activeTab === 'posts'
            ? 'border-b-2 border-[#4096FF] text-[#4096FF] font-semibold'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        My Posts
      </button>
      <button
        onClick={() => setActiveTab('achievements')}
        className={`px-6 py-3 transition-colors ${
          activeTab === 'achievements'
            ? 'border-b-2 border-[#4096FF] text-[#4096FF] font-semibold'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        My Achievements
      </button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );

    switch(activeTab) {
      case 'posts':
        return (
          <div className="p-6 space-y-6">
            {userPosts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                <span className="material-icons text-5xl text-gray-300 mb-4">article</span>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-6">Share your knowledge with the community</p>
                <button className="px-4 py-2 bg-[#4096FF] text-white rounded-md hover:bg-[#3085EE] transition-colors">
                  Create Your First Post
                </button>
              </div>
            ) : (
              userPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  userId={currentUser?.id}
                  onDelete={handlePostDeleted}
                  onUpdate={handlePostUpdated}
                />
              ))
            )}
          </div>
        );
      case 'achievements':
        return (
          <div className="p-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <AchievementForm onAchievementCreated={handleAchievementCreated} />
            
            <div className="mt-6 space-y-6">
              {selectedCategory === 'all' ? (
                achievements.length > 0 ? (
                  achievements.map(achievement => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onDelete={handleAchievementDeleted}
                      onUpdate={handleAchievementUpdated}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="material-icons text-5xl text-gray-300 mb-4">emoji_events</span>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No achievements yet</h3>
                    <p className="text-gray-500">Showcase your professional milestones</p>
                  </div>
                )
              ) : (
                (achievementsByCategory[selectedCategory]?.length > 0 ? (
                  achievementsByCategory[selectedCategory].map(achievement => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onDelete={handleAchievementDeleted}
                      onUpdate={handleAchievementUpdated}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="material-icons text-5xl text-gray-300 mb-4">category</span>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No achievements in {selectedCategory}</h3>
                    <p className="text-gray-500">Add your first achievement in this category</p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-16 ">
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8 transition-all duration-300">
        <div 
          className={`bg-gradient-to-r from-[#4096FF] to-[#12B981] transition-all duration-500 relative ${
            isHeaderExpanded ? 'py-16' : 'py-10'
          }`}
          onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
        >
          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform translate-y-2 opacity-30">
            <svg className="w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-white"></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-[#4096FF]/30 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/70 shadow-lg backdrop-blur-sm transform transition-transform duration-500 hover:scale-105">
                  {currentUser?.fullName?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase()}
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">{currentUser?.fullName || currentUser?.username}</h1>
                  <p className="text-blue-100">@{currentUser?.username}</p>
                  
                  {currentUser?.role === 'INSTRUCTOR' && currentUser?.isVerified && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#12B981]/30 backdrop-blur-sm text-white text-sm">
                      <span className="material-icons text-sm mr-1">verified</span>
                      Verified Instructor
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-6 md:ml-auto">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFollowers(true);
                  }}
                  className="text-white flex flex-col items-center cursor-pointer group"
                >
                  <span className="text-2xl font-bold group-hover:scale-110 transition-transform">{followerCount}</span>
                  <span className="text-blue-100 text-sm">Followers</span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFollowing(true);
                  }}
                  className="text-white flex flex-col items-center cursor-pointer group"
                >
                  <span className="text-2xl font-bold group-hover:scale-110 transition-transform">{followingCount}</span>
                  <span className="text-blue-100 text-sm">Following</span>
                </div>
              </div>
            </div>
            
            {isHeaderExpanded && (
              <div className="mt-6 text-white/90 max-w-2xl animate-fade-in">
                <p>{currentUser?.bio || 'No bio provided yet. Edit your profile to add your bio.'}</p>
                {currentUser?.specializations?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentUser.specializations.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {message.text && (
            <Alert
              type={message.type === 'error' ? 'error' : 'success'}
              message={message.text}
              onClose={() => setMessage({ text: '', type: '' })}
            />
          )}
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4096FF] transition-colors"
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4096FF] transition-colors"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4096FF] transition-colors"
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Role
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 bg-gray-100 rounded-lg w-full py-3 px-4 text-gray-600 leading-tight"
                    value={formData.role}
                    disabled
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4096FF] transition-colors"
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell others about yourself..."
                />
              </div>

              {currentUser?.role === 'INSTRUCTOR' && (
                <div className="mt-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Specializations <span className="text-gray-500 text-xs">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4096FF] transition-colors"
                    value={formData.specializations.join(', ')}
                    onChange={(e) => handleSpecializationsChange(e.target.value)}
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: currentUser.fullName || '',
                      email: currentUser.email || '',
                      username: currentUser.username || '',
                      bio: currentUser.bio || '',
                      specializations: currentUser.specializations || [],
                      role: currentUser.role || 'LEARNER'
                    });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white rounded-lg hover:from-[#3085EE] hover:to-[#0BA870] transition-all ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                className="px-6 py-2.5 bg-gradient-to-r from-[#4096FF] to-[#12B981] text-white rounded-lg hover:from-[#3085EE] hover:to-[#0BA870] transition-colors shadow-sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {renderTabs()}
        {renderContent()}
      </div>
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Followers</h3>
              <button 
                onClick={() => setShowFollowers(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="p-1 max-h-96 overflow-y-auto">
              {followers.length > 0 ? (
                followers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4096FF] to-[#12B981] rounded-full flex items-center justify-center text-white font-medium">
                        {user.fullName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{user.fullName || user.username}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <FollowButton userId={user.id} followerId={currentUser.id} onRefreshCounts={refreshFollowCounts} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <span className="material-icons text-4xl text-gray-300 mb-3">person_off</span>
                  <p className="text-gray-500">No followers yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Following</h3>
              <button 
                onClick={() => setShowFollowing(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="p-1 max-h-96 overflow-y-auto">
              {following.length > 0 ? (
                following.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4096FF] to-[#12B981] rounded-full flex items-center justify-center text-white font-medium">
                        {user.fullName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{user.fullName || user.username}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <FollowButton 
                      userId={user.id} 
                      followerId={currentUser.id} 
                      onRefreshCounts={refreshFollowCounts}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <span className="material-icons text-4xl text-gray-300 mb-3">person_off</span>
                  <p className="text-gray-500">Not following anyone yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;