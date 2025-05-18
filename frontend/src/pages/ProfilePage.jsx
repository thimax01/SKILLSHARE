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









import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { Download, FileText, User, Mail, Briefcase, Award, ChevronDown, X, Edit3, Save, Loader2, Sparkles } from 'lucide-react';
import FollowButton from '../components/FollowButton';
import AchievementCard from '../components/AchievementCard';
import PostCard from '../components/PostCard';
import AchievementForm from '../components/AchievementForm';
import Alert from '../components/Alert';

// CV template definitions
const CVTemplates = {
  modern: {
    name: 'Modern',
    template: ({ user, achievements }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Helvetica', sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #2D3748;
            }
            .header {
              background: linear-gradient(135deg, #4285F4, #36B7CD);
              color: white;
              padding: 40px;
              border-radius: 12px;
              margin-bottom: 40px;
              text-align: center;
            }
            .section {
              margin-bottom: 30px;
              padding: 20px;
              background: #F7FAFC;
              border-radius: 8px;
            }
            .section-title {
              color: #4285F4;
              border-bottom: 2px solid #4285F4;
              padding-bottom: 8px;
              margin-bottom: 16px;
            }
            .achievement {
              background: white;
              padding: 16px;
              margin-bottom: 16px;
              border-radius: 6px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .specialization {
              display: inline-block;
              background: #EBF4FF;
              color: #4285F4;
              padding: 4px 12px;
              border-radius: 16px;
              margin: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${user.fullName}</h1>
            <p>${user.email} | ${user.role}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p>${user.bio || 'No bio provided'}</p>
          </div>
          
          ${user.specializations?.length ? `
            <div class="section">
              <h2 class="section-title">Specializations</h2>
              <div>
                ${user.specializations.map(spec => `
                  <span class="specialization">${spec}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${achievements?.length ? `
            <div class="section">
              <h2 class="section-title">Achievements</h2>
              ${achievements.map(achievement => `
                <div class="achievement">
                  <h3>${achievement.title}</h3>
                  <p>${achievement.description}</p>
                  <p><em>${new Date(achievement.date).toLocaleDateString()}</em></p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `
  },
  professional: {
    name: 'Professional',
    template: ({ user, achievements }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #1A202C;
            }
            .header {
              border-bottom: 3px solid #4285F4;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .contact-info {
              color: #4A5568;
              margin-top: 8px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              color: #2D3748;
              border-bottom: 1px solid #CBD5E0;
              padding-bottom: 8px;
              margin-bottom: 16px;
            }
            .achievement {
              margin-bottom: 20px;
              padding-left: 16px;
              border-left: 2px solid #4285F4;
            }
            .specialization {
              margin-right: 16px;
              color: #4285F4;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${user.fullName}</h1>
            <div class="contact-info">
              ${user.email} | ${user.role}
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p>${user.bio || 'No bio provided'}</p>
          </div>
          
          ${user.specializations?.length ? `
            <div class="section">
              <h2 class="section-title">Areas of Expertise</h2>
              ${user.specializations.map(spec => `
                <span class="specialization">• ${spec}</span>
              `).join('')}
            </div>
          ` : ''}
          
          ${achievements?.length ? `
            <div class="section">
              <h2 class="section-title">Professional Achievements</h2>
              ${achievements.map(achievement => `
                <div class="achievement">
                  <h3>${achievement.title}</h3>
                  <p>${achievement.description}</p>
                  <p><em>${new Date(achievement.date).toLocaleDateString()}</em></p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `
  },
  creative: {
    name: 'Creative',
    template: ({ user, achievements }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #2D3748;
              background: #F7FAFC;
            }
            .header {
              position: relative;
              background: white;
              padding: 30px;
              border-radius: 20px;
              margin-bottom: 40px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 6px;
              background: linear-gradient(90deg, #4285F4, #36B7CD);
              border-radius: 20px 20px 0 0;
            }
            .section {
              background: white;
              padding: 24px;
              border-radius: 20px;
              margin-bottom: 24px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .section-title {
              color: #4285F4;
              font-size: 1.5em;
              margin-bottom: 20px;
            }
            .achievement {
              border-left: 4px solid #36B7CD;
              padding-left: 16px;
              margin-bottom: 20px;
            }
            .specialization {
              display: inline-block;
              background: linear-gradient(135deg, #4285F4, #36B7CD);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              margin: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${user.fullName}</h1>
            <p>${user.email} | ${user.role}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">About Me</h2>
            <p>${user.bio || 'No bio provided'}</p>
          </div>
          
          ${user.specializations?.length ? `
            <div class="section">
              <h2 class="section-title">Skills & Expertise</h2>
              <div>
                ${user.specializations.map(spec => `
                  <span class="specialization">${spec}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${achievements?.length ? `
            <div class="section">
              <h2 class="section-title">Milestones & Achievements</h2>
              ${achievements.map(achievement => `
                <div class="achievement">
                  <h3>${achievement.title}</h3>
                  <p>${achievement.description}</p>
                  <p><em>${new Date(achievement.date).toLocaleDateString()}</em></p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `
  }
};

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
  const [activeTab, setActiveTab] = useState('cv'); // Change default to CV tab
  const [achievements, setAchievements] = useState([]);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);

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
      
      fetchUserContent();
      fetchFollowStats();
      fetchAchievementCategories();
    }
  }, [currentUser]);

  const fetchUserContent = async () => {
    try {
      setIsLoading(true);
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
      setMessage({ type: 'error', text: 'Failed to load achievements' });
    }
  };

  const downloadCV = async () => {
    setIsGeneratingCV(true);
    try {
      const template = CVTemplates[selectedTemplate];
      const cvContent = template.template({ 
        user: currentUser, 
        achievements: achievements.sort((a, b) => new Date(b.date) - new Date(a.date))
      });
      
      const blob = new Blob([cvContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentUser.fullName.replace(/\s+/g, '_')}_CV.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setShowTemplateModal(false);
      setMessage({ type: 'success', text: 'CV downloaded successfully!' });
    } catch (error) {
      console.error('Error generating CV:', error);
      setMessage({ type: 'error', text: 'Failed to generate CV. Please try again.' });
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecializationsChange = (value) => {
    setFormData({
      ...formData,
      specializations: value.split(',').map(s => s.trim()).filter(s => s)
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
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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

  // Render CV preview based on template
  const renderCVPreview = () => {
    if (!currentUser) return null;
    
    // Modern template
    if (selectedTemplate === 'modern') {
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{currentUser.fullName}</h1>
            <p className="text-lg">{currentUser.email} | {currentUser.role}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#4285F4] border-b-2 border-[#4285F4] pb-2 mb-3">
                Professional Summary
              </h2>
              <p className="text-gray-700">{currentUser.bio || 'No bio provided'}</p>
            </div>
            
            {currentUser.specializations?.length ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#4285F4] border-b-2 border-[#4285F4] pb-2 mb-3">
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {currentUser.specializations.map((spec, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            
            {achievements?.length ? (
              <div>
                <h2 className="text-xl font-semibold text-[#4285F4] border-b-2 border-[#4285F4] pb-2 mb-3">
                  Achievements
                </h2>
                <div className="space-y-4">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium text-lg text-gray-800">{achievement.title}</h3>
                      <p className="text-gray-600 my-2">{achievement.description}</p>
                      <p className="text-sm text-gray-500 italic">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    
    // Professional template
    if (selectedTemplate === 'professional') {
      return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8 border-b-4 border-[#4285F4]">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentUser.fullName}</h1>
            <p className="text-gray-600">{currentUser.email} | {currentUser.role}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">
                Professional Summary
              </h2>
              <p className="text-gray-700">{currentUser.bio || 'No bio provided'}</p>
            </div>
            
            {currentUser.specializations?.length ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap">
                  {currentUser.specializations.map((spec, index) => (
                    <span key={index} className="text-[#4285F4] mr-4">• {spec}</span>
                  ))}
                </div>
              </div>
            ) : null}
            
            {achievements?.length ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">
                  Professional Achievements
                </h2>
                <div className="space-y-4">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="pl-4 border-l-2 border-[#4285F4] mb-4">
                      <h3 className="font-medium text-lg text-gray-800">{achievement.title}</h3>
                      <p className="text-gray-600 my-2">{achievement.description}</p>
                      <p className="text-sm text-gray-500 italic">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    
    // Creative template
    return (
      <div className="bg-gray-50 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-white p-6 relative shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4285F4] to-[#36B7CD]"></div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">{currentUser.fullName}</h1>
          <p className="text-gray-600">{currentUser.email} | {currentUser.role}</p>
        </div>
        
        <div className="p-6">
          <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
            <h2 className="text-xl font-semibold text-[#4285F4] mb-3">About Me</h2>
            <p className="text-gray-700">{currentUser.bio || 'No bio provided'}</p>
          </div>
          
          {currentUser.specializations?.length ? (
            <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
              <h2 className="text-xl font-semibold text-[#4285F4] mb-3">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {currentUser.specializations.map((spec, index) => (
                  <span key={index} className="bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white px-3 py-1 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          
          {achievements?.length ? (
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-[#4285F4] mb-3">Milestones & Achievements</h2>
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="border-l-4 border-[#36B7CD] pl-4 mb-4">
                    <h3 className="font-medium text-lg text-gray-800">{achievement.title}</h3>
                    <p className="text-gray-600 my-2">{achievement.description}</p>
                    <p className="text-sm text-gray-500 italic">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderTabs = () => (
    <div className="flex border-b">
      <button
        onClick={() => setActiveTab('cv')}
        className={`px-6 py-3 transition-colors ${
          activeTab === 'cv'
            ? 'border-b-2 border-[#4285F4] text-[#4285F4] font-semibold'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        CV Builder
      </button>
      <button
        onClick={() => setActiveTab('posts')}
        className={`px-6 py-3 transition-colors ${
          activeTab === 'posts'
            ? 'border-b-2 border-[#4285F4] text-[#4285F4] font-semibold'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        My Posts
      </button>
      <button
        onClick={() => setActiveTab('achievements')}
        className={`px-6 py-3 transition-colors ${
          activeTab === 'achievements'
            ? 'border-b-2 border-[#4285F4] text-[#4285F4] font-semibold'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        My Achievements
      </button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
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
    }

    switch(activeTab) {
      case 'cv':
        return (
          <div className="py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#4285F4]/10 to-[#36B7CD]/10 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional CV Builder</h2>
                <p className="text-gray-600 max-w-2xl">
                  Create a professional CV showcasing your skills and achievements. 
                  Choose from multiple templates, preview your CV, and download it 
                  to share with potential employers.
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                      {Object.entries(CVTemplates).map(([id, template]) => (
                        <div
                          key={id}
                          onClick={() => setSelectedTemplate(id)}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                            selectedTemplate === id ? 'border-[#4285F4] shadow-lg scale-105' : 'border-gray-200'
                          }`}
                        >
                          <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-[#4285F4] to-[#36B7CD] flex items-center justify-center">
                            <FileText className="w-12 h-12 text-white" />
                          </div>
                          <div className="p-3 text-center bg-gray-50">
                            <p className="font-medium text-gray-700">{template.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={downloadCV}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white rounded-lg font-medium flex items-center justify-center hover:shadow-md transition-all"
                        disabled={isGeneratingCV}
                      >
                        {isGeneratingCV ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating CV...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download CV
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {renderCVPreview()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'posts':
        return (
          <div className="p-6 space-y-6">
            {userPosts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-6">Share your knowledge with the community</p>
                <button className="px-4 py-2 bg-[#4285F4] text-white rounded-md hover:bg-[#3B76E1] transition-colors">
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
                    ? 'bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white shadow-sm' 
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
                      ? 'bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white shadow-sm' 
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
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
    <div className="pt-16">
      <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8 transition-all duration-300">
          <div 
            className={`bg-gradient-to-r from-[#4285F4] to-[#36B7CD] transition-all duration-500 relative ${
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
                  <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-[#4285F4]/30 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/70 shadow-lg backdrop-blur-sm transform transition-transform duration-500 hover:scale-105">
                    {currentUser?.fullName?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="ml-6">
                    <h1 className="text-3xl font-bold text-white">{currentUser?.fullName || currentUser?.username}</h1>
                    <p className="text-blue-100">@{currentUser?.username}</p>
                    
                    {currentUser?.role === 'INSTRUCTOR' && currentUser?.isVerified && (
                      <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#36B7CD]/30 backdrop-blur-sm text-white text-sm">
                        <Sparkles className="w-4 h-4 mr-1" />
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
                      className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4285F4] transition-colors"
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
                      className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4285F4] transition-colors"
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
                      className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4285F4] transition-colors"
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
                    className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4285F4] transition-colors"
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
                      className="appearance-none border-2 border-gray-300 bg-white rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#4285F4] transition-colors"
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
                    className={`px-6 py-2.5 bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white rounded-lg hover:from-[#3B76E1] hover:to-[#2AACBD] transition-all ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#4285F4] to-[#36B7CD] text-white rounded-lg hover:from-[#3B76E1] hover:to-[#2AACBD] transition-colors shadow-sm flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4" />
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

      {/* CV Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Choose CV Template</h3>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-3 gap-4">
              {Object.entries(CVTemplates).map(([id, template]) => (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedTemplate(id);
                    downloadCV();
                  }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedTemplate === id ? 'border-[#4285F4]' : 'border-gray-200'
                  }`}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#4285F4] to-[#36B7CD] flex items-center justify-center">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                  <div className="p-3 text-center bg-gray-50">
                    <p className="font-medium text-gray-700">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-1 max-h-96 overflow-y-auto">
              {followers.length > 0 ? (
                followers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4285F4] to-[#36B7CD] rounded-full flex items-center justify-center text-white font-medium">
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
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-1 max-h-96 overflow-y-auto">
              {following.length > 0 ? (
                following.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4285F4] to-[#36B7CD] rounded-full flex items-center justify-center text-white font-medium">
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
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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