// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import PostCard from '../components/PostCard';
// import PostForm from '../components/PostForm';
// import { useUser } from '../contexts/UserContext';
// import { motion } from 'framer-motion';

// const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { currentUser } = useUser();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:8081/api/posts');
//         setPosts(response.data);
//       } catch (err) {
//         console.error('Error fetching posts:', err);
//         setError('Failed to load posts. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handlePostCreated = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts]);
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-8 p-4">
//       {loading ? (
//         <motion.div
//           className="flex items-center justify-center h-screen"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
//             <p className="mt-4 text-gray-500">Loading posts...</p>
//           </div>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//             Welcome to SkillShare
//           </h1>

//           {currentUser && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <PostForm onPostCreated={handlePostCreated} />
//             </motion.div>
//           )}

//           {error && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4 max-w-2xl mx-auto"
//             >
//               <p className="text-red-500">{error}</p>
//             </motion.div>
//           )}

//           <h2 className="text-xl font-medium mb-4 text-gray-800 max-w-2xl mx-auto">
//             Recent Posts
//           </h2>

//           {posts.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="bg-white p-4 rounded-lg shadow-md max-w-2xl mx-auto"
//             >
//               <p className="text-gray-600">No posts available. Be the first to create one!</p>
//             </motion.div>
//           ) : (
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 hidden: { opacity: 0, scale: 0.95 },
//                 visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } },
//               }}
//               className="space-y-4 max-w-2xl mx-auto"
//             >
//               {posts.map((post) => (
//                 <motion.div
//                   key={post.id}
//                   variants={{
//                     hidden: { opacity: 0, y: 20 },
//                     visible: { opacity: 1, y: 0 },
//                   }}
//                 >
//                   <PostCard post={post} userId={currentUser?.id} />
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, User } from 'lucide-react';
import AchievementCard from '../components/AchievementCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [postsRes, achievementsRes] = await Promise.all([
          axios.get('http://localhost:8081/api/posts'),
          axios.get('http://localhost:8081/api/achievements')
        ]);
        setPosts(postsRes.data);
        setAchievements(achievementsRes.data);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const ProfileSidebar = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
          {currentUser?.fullName?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{currentUser?.fullName}</h2>
        <p className="text-gray-500">@{currentUser?.username}</p>
        {currentUser?.role === 'INSTRUCTOR' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
            Instructor
          </span>
        )}
      </div>
      
      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Bio</h3>
        <p className="text-gray-600">{currentUser?.bio || 'No bio yet'}</p>
      </div>

      {currentUser?.specializations?.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.specializations.map((spec, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const AchievementsSidebar = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Award className="text-teal-500" />
        Recent Achievements
      </h2>
      <div className="space-y-4">
        {achievements.slice(0, 3).map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            simplified={true}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
      {loading ? (
        <motion.div
          className="flex items-center justify-center min-h-[50vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <div className="inline-block h-16 w-16 relative">
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-teal-400 border-l-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-teal-500 animate-spin animate-reverse"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Loading amazing content...</p>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 inline-flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span>SkillShare</span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Connect with others, share your knowledge, and grow together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Profile */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <ProfileSidebar />
              </div>
            </div>

            {/* Main Content - Posts */}
            <div className="lg:col-span-6">
              {currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <PostForm onPostCreated={handlePostCreated} />
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6"
                >
                  <p className="text-red-600 font-medium">{error}</p>
                </motion.div>
              )}

              <motion.h2 
                className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-500 to-teal-400 rounded-full mr-2"></span>
                Recent Posts
              </motion.h2>

              <AnimatePresence>
                {posts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white p-8 rounded-xl shadow-md text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                      <Sparkles size={24} />
                    </div>
                    <p className="text-gray-600 font-medium">No posts available. Be the first to create one!</p>
                    {!currentUser && (
                      <p className="text-gray-500 mt-2 text-sm">Sign in to share your knowledge with others.</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { 
                        opacity: 1, 
                        transition: { 
                          staggerChildren: 0.1,
                          delayChildren: 0.4
                        } 
                      },
                    }}
                    className="space-y-6"
                  >
                    {posts.map((post) => (
                      <motion.div
                        key={post.id}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <PostCard 
                          post={post} 
                          userId={currentUser?.id} 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar - Achievements */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <AchievementsSidebar />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
