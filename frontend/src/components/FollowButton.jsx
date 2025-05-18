// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const FollowButton = ({ userId, followerId, onRefreshCounts }) => {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     checkFollowStatus();
//   }, [userId, followerId]);

//   const checkFollowStatus = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/users/${userId}/follow-status?followerId=${followerId}`
//       );
//       setIsFollowing(response.data.following);
//     } catch (error) {
//       console.error('Error checking follow status:', error);
//     }
//   };

//   const handleToggleFollow = async () => {
//     if (!followerId || loading) return;

//     setLoading(true);
//     try {
//       if (isFollowing) {
//         await axios.delete(
//           `http://localhost:8081/api/users/${userId}/unfollow?followerId=${followerId}`
//         );
//         setIsFollowing(false);
//       } else {
//         await axios.post(
//           `http://localhost:8081/api/users/${userId}/follow?followerId=${followerId}`
//         );
//         setIsFollowing(true);
//       }
//       // Call the refresh callback
//       if (onRefreshCounts) {
//         onRefreshCounts();
//       }
//     } catch (error) {
//       console.error('Error toggling follow:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       onClick={handleToggleFollow}
//       className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
//         isFollowing
//           ? 'text-transparent bg-clip-text bg-green-500'
//           : 'text-transparent bg-clip-text bg-blue-600'
//       } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//     >
//       {isFollowing ? 'Following' : 'Follow'}
//     </div>
//   );
// };

// export default FollowButton;



import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const FollowButton = ({ userId, followerId, onRefreshCounts }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, [userId, followerId]);

  const checkFollowStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/users/${userId}/follow-status?followerId=${followerId}`
      );
      setIsFollowing(response.data.following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!followerId || loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await axios.delete(
          `http://localhost:8081/api/users/${userId}/unfollow?followerId=${followerId}`
        );
        setIsFollowing(false);
      } else {
        await axios.post(
          `http://localhost:8081/api/users/${userId}/follow?followerId=${followerId}`
        );
        setIsFollowing(true);
      }
      // Call the refresh callback
      if (onRefreshCounts) {
        onRefreshCounts();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleToggleFollow}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
        isFollowing 
          ? 'bg-green-50 text-green-600 border border-green-200' 
          : 'bg-blue-50 text-blue-600 border border-blue-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
      disabled={loading}
    >
      {isFollowing ? (
        <>
          <UserCheck size={16} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={16} />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;