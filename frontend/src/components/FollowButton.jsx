import { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div
      onClick={handleToggleFollow}
      className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
        isFollowing
          ? 'text-transparent bg-clip-text bg-green-500'
          : 'text-transparent bg-clip-text bg-blue-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </div>
  );
};

export default FollowButton;
