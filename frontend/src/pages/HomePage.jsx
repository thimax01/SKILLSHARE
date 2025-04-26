import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8081/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      {loading ? (
        <motion.div
          className="flex items-center justify-center h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading posts...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Welcome to SkillShare
          </h1>

          {currentUser && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PostForm onPostCreated={handlePostCreated} />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4 max-w-2xl mx-auto"
            >
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          <h2 className="text-xl font-medium mb-4 text-gray-800 max-w-2xl mx-auto">
            Recent Posts
          </h2>

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 rounded-lg shadow-md max-w-2xl mx-auto"
            >
              <p className="text-gray-600">No posts available. Be the first to create one!</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } },
              }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <PostCard post={post} userId={currentUser?.id} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
