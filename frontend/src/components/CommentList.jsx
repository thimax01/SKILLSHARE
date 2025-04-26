import { useState, useEffect } from 'react';
import { getComments } from '../services/api';
import LoadingIndicator from './LoadingIndicator';
import CommentItem from './CommentItem';

const CommentList = ({ postId, userId, initialComments = [] }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      setLoading(true); // Set loading to true
      try {
        const data = await getComments(postId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    // Only fetch if we don't have initial comments
    if (initialComments.length === 0) {
      fetchComments();
    } else {
      setComments(initialComments);
    }
  }, [postId, initialComments]);

  // Update comments when initialComments changes
  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      const uniqueComments = [];
      const seenIds = new Set();

      // First add all initialComments
      initialComments.forEach(comment => {
        if (!seenIds.has(comment.id)) {
          seenIds.add(comment.id);
          uniqueComments.push(comment);
        }
      });

      // Then add any existing comments that aren't in initialComments
      comments.forEach(comment => {
        if (!seenIds.has(comment.id)) {
          seenIds.add(comment.id);
          uniqueComments.push(comment);
        }
      });

      setComments(uniqueComments);
    }
  }, [initialComments]);

  // Handle comment deletion
  const handleDelete = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  // Handle comment update
  const handleUpdate = (updatedComment) => {
    setComments(prev => {
      if (prev.some(comment => comment.id === updatedComment.id)) {
        return prev.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
      }
      return prev;
    });
  };

  // Add a new comment to the list
  const addComment = (newComment) => {
    setComments(prev => [...prev, newComment]);
  };

  if (loading) {
    return <LoadingIndicator message="Loading comments..." />;
  }

  return (
    <div className={`mt-4 space-y-3 ${loading ? 'pointer-events-none' : ''}`}>
      <h3 className="font-medium text-gray-700">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            userId={userId}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
