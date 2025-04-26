import { useState } from 'react';
import { deleteComment } from '../services/api';
import { parseMentions } from '../utils/mentionParser';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, userId, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isOwner = userId === comment.userId;
  const formattedDate = new Date(comment.createdAt).toLocaleString();
  
  const handleDelete = () => {
    if (!isOwner || isDeleting) return;
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(comment.id, userId);
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleUpdate = (updatedComment) => {
    if (onUpdate) {
      onUpdate(updatedComment);
    }
    setIsEditing(false);
  };
  
  return (
    <div className="comment-item bg-gray-50 p-3 rounded-md transition-colors duration-300">
      {isEditing ? (
        <CommentForm
          commentId={comment.id}
          userId={userId}
          initialText={comment.text}
          isEditing={true}
          onCommentAdded={handleUpdate}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-sm break-words">{parseMentions(comment.text)}</p>
              <span className="text-xs text-gray-500 mt-1">{formattedDate}</span>
            </div>
            
            {isOwner && (
              <div className="flex space-x-2">
                <span
                  onClick={handleEdit}
                  className="cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500"
                  title="Edit"
                >
                  <span className="material-icons">edit</span>
                </span>
                <span
                  onClick={handleDelete}
                  className={`cursor-pointer text-red-500 hover:text-red-500 ${
                    isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Delete"
                >
                  <span className="material-icons">delete</span>
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {showConfirmModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <span
                onClick={() => setShowConfirmModal(false)}
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </span>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
