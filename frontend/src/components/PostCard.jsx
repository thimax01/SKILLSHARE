// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import LikeButton from './LikeButton';
// import CommentList from './CommentList';
// import CommentForm from './CommentForm';
// import useWebSocket from '../hooks/useWebSocket';
// import { getUser, getComments } from '../services/api';
// import { useUser } from '../contexts/UserContext';
// import axios from 'axios';
// import PostForm from './PostForm'; // Add this import
// import FollowButton from './FollowButton';
// import Alert from './Alert';
// import ConfirmationModal from './ConfirmationModal';

// import { motion } from 'framer-motion';

// const PostCard = ({ post: initialPost, userId, detailed = false, onDelete, onUpdate }) => {
//   const { currentUser } = useUser();
//   const [post, setPost] = useState(initialPost);
//   const [loading, setLoading] = useState(false); // Add loading state
//   const [authorName, setAuthorName] = useState('');
//   const [showComments, setShowComments] = useState(detailed);
//   const [isEditing, setIsEditing] = useState(false);
//   const isOwner = currentUser?.id === post.userId;
//   const [comments, setComments] = useState(initialPost.comments || []);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [userGroups, setUserGroups] = useState([]);
//   const [isLiked, setIsLiked] = useState(false);
//   const navigate = useNavigate();
//   const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   // Use WebSocket for real-time updates
//   const { connected, likeCount: wsLikeCount, comments: wsComments } = useWebSocket(post.id);

//   // Local state for likes and comments
//   const [localLikeCount, setLocalLikeCount] = useState(post.likeCount || 0);

//   // Update like count from WebSocket
//   useEffect(() => {
//     if (connected && wsLikeCount > 0) {
//       setLocalLikeCount(wsLikeCount);
//     }
//   }, [connected, wsLikeCount]);

//   // Fetch author name
//   useEffect(() => {
//     const fetchAuthor = async () => {
//       try {
//         const userData = await getUser(post.userId);
//         setAuthorName(userData.fullName || userData.username);
//       } catch (error) {
//         console.error('Error fetching post author:', error);
//       }
//     };

//     if (post.userId) {
//       fetchAuthor();
//     }
//   }, [post.userId]);

//   // Update local state for comments when websocket sends new data
//   useEffect(() => {
//     if (wsComments && wsComments.length > 0) {
//       const newComment = wsComments[wsComments.length - 1];
//       setComments(prevComments => {
//         const commentExists = prevComments.some(comment => comment.id === newComment.id);
//         if (!commentExists) {
//           return [...prevComments, newComment];
//         }
//         return prevComments;
//       });
//     }
//   }, [wsComments]);

//   // Check initial like status and count
//   useEffect(() => {
//     let isSubscribed = true;
//     const checkLikeStatus = async () => {
//       if (!userId || !post.id) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/posts/${post.id}/likes`,
//           {
//             params: { userId },
//             timeout: 5000
//           }
//         );

//         if (isSubscribed && response.data) {
//           setIsLiked(response.data.hasLiked || false);
//           setLocalLikeCount(response.data.likeCount || 0);
//         }
//       } catch (error) {
//         console.error('Error checking like status:', error);
//         if (error.response?.status === 500) {
//           console.log('Like status check failed, using default state');
//         }
//       }
//     };

//     checkLikeStatus();

//     return () => {
//       isSubscribed = false;
//     };
//   }, [post.id, userId]);

//   // Handle new comment added
//   const handleCommentAdded = (newComment) => {
//     setComments(prevComments => {
//       const commentExists = prevComments.some(comment => comment.id === newComment.id);
//       if (!commentExists) {
//         return [...prevComments, newComment];
//       }
//       return prevComments;
//     });
//     setShowComments(true);
//   };

//   // Toggle comments section and fetch comments if needed
//   const toggleComments = async () => {
//     if (!detailed && !showComments) {
//       try {
//         const response = await getComments(post.id);
//         if (response) {
//           setComments(response);
//         }
//       } catch (error) {
//         if (error.response?.status === 404) {
//           // Post was deleted or unavailable
//           setComments([]);
//           if (onDelete) {
//             onDelete(post.id); // Remove post from list if it's no longer available
//           }
//         } else {
//           console.error('Error fetching comments:', error);
//         }
//       }
//     }
//     setShowComments(prev => !prev);
//   };

//   const renderVideo = () => {
//     if (!post.videoUrl) return null;

//     return (
//       <div className="w-full mb-4 overflow-hidden rounded-lg">
//         <video
//           src={`http://localhost:8081${post.videoUrl}`}
//           autoPlay
//           loop
//           muted
//           controls
//           className="w-full"
//         />
//       </div>
//     );
//   };

//   const handleDelete = () => {
//     setShowConfirmModal(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       const response = await axios.delete(`http://localhost:8081/api/posts/${post.id}?userId=${currentUser.id}`);
//       if (onDelete) {
//         onDelete(post.id);
//       } else {
//         setAlert({ isOpen: true, type: 'success', message: response.data.message || 'Post deleted successfully' });
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to delete post. Please try again.' });
//     } finally {
//       setShowConfirmModal(false);
//     }
//   };

//   const handleUpdate = async (updatedPost) => {
//     try {
//       if (onUpdate) {
//         onUpdate(updatedPost);
//       } else {
//         window.location.reload();
//       }
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating post:', error);
//       alert(error.response?.data?.message || 'Failed to update post. Please try again.');
//     }
//   };

//   // Record view when post is loaded
//   useEffect(() => {
//     const recordView = async () => {
//       if (!post?.id || !userId) return; // Add null check

//       try {
//         const token = localStorage.getItem('skillshare_token');
//         await axios.post(
//           `http://localhost:8081/api/posts/${post.id}/views`, 
//           { viewerId: userId },
//           { 
//             headers: { 'Authorization': `Bearer ${token}` },
//             timeout: 5000 // Add timeout
//           }
//         );
//       } catch (error) {
//         // Just log the error without affecting user experience
//         console.debug('Error recording view:', error?.message);
//       }
//     };

//     recordView();
//   }, [post?.id, userId]);

//   const handleShareToGroup = async (groupId) => {
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.post(
//         `http://localhost:8081/api/groups/${groupId}/posts?userId=${currentUser.id}`,
//         { postId: post.id },
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );

//       if (response.data.alreadyShared) {
//         setAlert({ isOpen: true, type: 'warning', message: 'This post is already shared in the selected group.' });
//       } else {
//         setAlert({ isOpen: true, type: 'success', message: 'Post shared successfully!' });
//       }

//       setShowShareModal(false);
//     } catch (error) {
//       console.error('Error sharing post:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to share post';
//       setAlert({ isOpen: true, type: 'error', message: errorMessage });
//       setShowShareModal(false);
//     }
//   };

//   const handleLikeToggle = async () => {
//     if (!userId) return;

//     const previousLikeState = isLiked;
//     const previousCount = localLikeCount;

//     try {
//       setIsLiked(!isLiked);
//       setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);

//       const endpoint = `http://localhost:8081/api/posts/${post.id}/like?userId=${userId}`;
//       const response = await (isLiked ?
//         axios.delete(endpoint) :
//         axios.post(endpoint)
//       );

//       // Update the like count from the response
//       if (response.data && typeof response.data.likeCount === 'number') {
//         setLocalLikeCount(response.data.likeCount);
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//       // Revert optimistic updates on error
//       setIsLiked(previousLikeState);
//       setLocalLikeCount(previousCount);

//       if (error.response?.status !== 500) {
//         const errorMessage = error.response?.data?.message || 'Failed to update like status';
//         console.warn(errorMessage);
//       }
//     }
//   };

//   // Update this effect to correctly fetch user groups when the modal opens
//   useEffect(() => {
//     const fetchUserGroups = async () => {
//       if (!currentUser) return;
//       try {
//         const token = localStorage.getItem('skillshare_token');
//         // Use this endpoint to get ALL groups (both joined and owned)
//         const response = await axios.get(
//           `http://localhost:8081/api/groups/user/${currentUser.id}/all`,
//           { headers: { 'Authorization': `Bearer ${token}` } }
//         );
//         console.log('Fetched all user groups:', response.data);
//         setUserGroups(response.data);
//       } catch (error) {
//         console.error('Error fetching user groups:', error);
//       }
//     };

//     if (showShareModal) {
//       fetchUserGroups();
//     }
//   }, [currentUser, showShareModal]);

//   // Share modal with increased contrast and black text for better visibility
//   const renderShareModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4 text-black">Share to Group</h2>
//         {userGroups.length === 0 ? (
//           <p className="text-black font-medium">You haven't joined any groups yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {userGroups.map((group) => (
//               <div
//                 key={group.id}
//                 className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer bg-gray-50"
//                 onClick={() => handleShareToGroup(group.id)}
//               >
//                 <h3 className="font-bold text-black text-lg">{group.name}</h3>
//                 <p className="text-sm text-black font-medium">{group.description}</p>
//                 {group.ownerId === currentUser?.id && (
//                   <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
//                     You own this group
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//         <button
//           onClick={() => setShowShareModal(false)}
//           className="mt-4 px-4 py-2 text-black font-medium hover:bg-gray-100 rounded"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );

//   useEffect(() => {
//     const fetchPostDetails = async () => {
//       setLoading(true); // Set loading to true
//       try {
//         // Simulate fetching additional post details if needed
//         // Example: const response = await axios.get(`/api/posts/${post.id}`);
//         // setPost(response.data);
//       } catch (error) {
//         console.error('Error fetching post details:', error);
//       } finally {
//         setLoading(false); // Set loading to false
//       }
//     };

//     fetchPostDetails();
//   }, [post.id]);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 mb-4 text-gray-800 border border-facebook-divider max-w-2xl mx-auto">
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-4 bg-gray-200 rounded w-full"></div>
//           <div className="h-4 bg-gray-200 rounded w-full"></div>
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="bg-white rounded-lg shadow-md p-4 mb-4 text-gray-800 border border-facebook-divider max-w-2xl mx-auto relative top-1/2 transform -translate-y-1/2"
//       whileHover={{ scale: 1.02 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Alert
//         isOpen={alert.isOpen}
//         type={alert.type}
//         title={alert.type === 'success' ? 'Success' : alert.type === 'error' ? 'Error' : 'Info'}
//         message={alert.message}
//         onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
//       />
//       {isEditing ? (
//         <PostForm
//           initialData={post}
//           isEditing={true}
//           onPostCreated={handleUpdate}
//           onCancel={() => setIsEditing(false)}
//         />
//       ) : (
//         <>
//           <div className="flex justify-between mb-3">
//             <div className="flex items-center">
//               <div>
//                 <h3 className="font-medium text-black">{post.title}</h3>
//                 <p className="text-sm text-gray-500 ml-2">
//                   Posted by {authorName || 'Anonymous'} •
//                   {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               {userId && userId !== post.userId && (
//                 <FollowButton userId={post.userId} followerId={userId} />
//               )}
//               {isOwner && currentUser && (
//                 <div className="flex space-x-2">
//                   <span
//                     onClick={() => setIsEditing(true)}
//                     className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 cursor-pointer"
//                     title="Edit"
//                   >
//                     <span className="material-icons">edit</span>
//                   </span>
//                   <span
//                     onClick={handleDelete}
//                     className="text-red-500 hover:text-red-700 cursor-pointer"
//                     title="Delete"
//                   >
//                     <span className="material-icons">delete</span>
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Post content */}
//           <div className="mb-4">
//             {post.imageUrls && post.imageUrls.length > 0 && (
//               <div className="grid grid-cols-3 gap-2">
//                 {post.imageUrls.map((url, index) => (
//                   <img
//                     key={index}
//                     src={`http://localhost:8081${url}`}
//                     alt={`Post image ${index + 1}`}
//                     className="w-full h-auto rounded-lg max-h-96 object-cover"
//                   />
//                 ))}
//               </div>
//             )}
//             {renderVideo()}
//             <p className="text-black">{post.content}</p>
//           </div>

//           {/* Post actions */}
//           <div className="flex justify-between items-center border-t border-b border-gray-200 py-2 my-2">
//             {/* Like button with heart icon */}
//             <div
//               onClick={handleLikeToggle}
//               className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium cursor-pointer transition-colors ${
//                 isLiked
//                   ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500'
//                   : 'text-gray-500 hover:text-black'
//               }`}
//             >
//               <span className={`material-icons text-base ${isLiked ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500' : 'text-gray-400 hover:text-red-600'}`}>
//                 {isLiked ? 'favorite' : 'favorite_border'}
//               </span>
//               {localLikeCount} {localLikeCount === 1 ? 'Like' : 'Likes'}
//             </div>
//             <div
//               onClick={() => setShowShareModal(true)}
//               className="inline-flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-black transition-colors text-sm font-medium cursor-pointer"
//             >
//               <span className="material-icons text-base text-gray-500 hover:text-black">share</span>
//               Share
//             </div>
//             {!detailed && (
//               <div
//                 onClick={toggleComments}
//                 className="inline-flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-black transition-colors text-sm font-medium cursor-pointer"
//               >
//                 <span className="material-icons text-base text-gray-500 hover:text-black">comment</span>
//                 {showComments ? 'Hide Comments' : 'Show Comments'}
//               </div>
//             )}

//             {!detailed && (
//               <Link
//                 to={`/post/${post.id}`}
//                 className="text-facebook-primary hover:text-facebook-hover transition-colors text-sm"
//               >
//                 View Details
//               </Link>
//             )}
//           </div>

//           {/* Comments section */}
//           {showComments && (
//             <div className="mt-4">
//               <CommentForm
//                 postId={post.id}
//                 userId={userId}
//                 onCommentAdded={handleCommentAdded}
//               />

//               <CommentList
//                 postId={post.id}
//                 userId={userId}
//                 initialComments={comments}
//               />
//             </div>
//           )}

//           {showShareModal && renderShareModal()}
//         </>
//       )}
//       {showConfirmModal && (
//         <ConfirmationModal
//           isOpen={showConfirmModal}
//           title="Confirm Deletion"
//           message="Are you sure you want to delete this post? This action cannot be undone."
//           onConfirm={confirmDelete}
//           onCancel={() => setShowConfirmModal(false)}
//         />
//       )}
//     </motion.div>
//   );
// };

// export default PostCard;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import useWebSocket from '../hooks/useWebSocket';
import { getUser, getComments } from '../services/api';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import PostForm from './PostForm';
import FollowButton from './FollowButton';
import Alert from './Alert';
import ConfirmationModal from './ConfirmationModal';
import { Heart, MessageCircle, Share2, Edit, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const PostCard = ({ post: initialPost, userId, detailed = false, onDelete, onUpdate }) => {
  const { currentUser } = useUser();
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [showComments, setShowComments] = useState(detailed);
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = currentUser?.id === post.userId;
  const [comments, setComments] = useState(initialPost.comments || []);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Use WebSocket for real-time updates
  const { connected, likeCount: wsLikeCount, comments: wsComments } = useWebSocket(post.id);

  // Local state for likes and comments
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount || 0);

  // Update like count from WebSocket
  useEffect(() => {
    if (connected && wsLikeCount > 0) {
      setLocalLikeCount(wsLikeCount);
    }
  }, [connected, wsLikeCount]);

  // Fetch author name
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await getUser(post.userId);
        setAuthorName(userData.fullName || userData.username);
      } catch (error) {
        console.error('Error fetching post author:', error);
      }
    };

    if (post.userId) {
      fetchAuthor();
    }
  }, [post.userId]);

  // Update local state for comments when websocket sends new data
  useEffect(() => {
    if (wsComments && wsComments.length > 0) {
      const newComment = wsComments[wsComments.length - 1];
      setComments(prevComments => {
        const commentExists = prevComments.some(comment => comment.id === newComment.id);
        if (!commentExists) {
          return [...prevComments, newComment];
        }
        return prevComments;
      });
    }
  }, [wsComments]);

  // Check initial like status and count
  useEffect(() => {
    let isSubscribed = true;
    const checkLikeStatus = async () => {
      if (!userId || !post.id) return;

      try {
        const response = await axios.get(
          `http://localhost:8081/api/posts/${post.id}/likes`,
          {
            params: { userId },
            timeout: 5000
          }
        );

        if (isSubscribed && response.data) {
          setIsLiked(response.data.hasLiked || false);
          setLocalLikeCount(response.data.likeCount || 0);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
        if (error.response?.status === 500) {
          console.log('Like status check failed, using default state');
        }
      }
    };

    checkLikeStatus();

    return () => {
      isSubscribed = false;
    };
  }, [post.id, userId]);

  // Handle new comment added
  const handleCommentAdded = (newComment) => {
    setComments(prevComments => {
      const commentExists = prevComments.some(comment => comment.id === newComment.id);
      if (!commentExists) {
        return [...prevComments, newComment];
      }
      return prevComments;
    });
    setShowComments(true);
  };

  // Toggle comments section and fetch comments if needed
  const toggleComments = async () => {
    if (!detailed && !showComments) {
      try {
        const response = await getComments(post.id);
        if (response) {
          setComments(response);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Post was deleted or unavailable
          setComments([]);
          if (onDelete) {
            onDelete(post.id); // Remove post from list if it's no longer available
          }
        } else {
          console.error('Error fetching comments:', error);
        }
      }
    }
    setShowComments(prev => !prev);
  };

  const renderVideo = () => {
    if (!post.videoUrl) return null;

    return (
      <div className="w-full mb-4 overflow-hidden rounded-xl shadow-sm">
        <video
          src={`http://localhost:8081${post.videoUrl}`}
          autoPlay
          loop
          muted
          controls
          className="w-full"
        />
      </div>
    );
  };

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/posts/${post.id}?userId=${currentUser.id}`);
      if (onDelete) {
        onDelete(post.id);
      } else {
        setAlert({ isOpen: true, type: 'success', message: response.data.message || 'Post deleted successfully' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to delete post. Please try again.' });
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleUpdate = async (updatedPost) => {
    try {
      if (onUpdate) {
        onUpdate(updatedPost);
      } else {
        window.location.reload();
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error.response?.data?.message || 'Failed to update post. Please try again.');
    }
  };

  // Record view when post is loaded
  useEffect(() => {
    const recordView = async () => {
      if (!post?.id || !userId) return;

      try {
        const token = localStorage.getItem('skillshare_token');
        await axios.post(
          `http://localhost:8081/api/posts/${post.id}/views`, 
          { viewerId: userId },
          { 
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 5000
          }
        );
      } catch (error) {
        console.debug('Error recording view:', error?.message);
      }
    };

    recordView();
  }, [post?.id, userId]);

  const handleShareToGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.post(
        `http://localhost:8081/api/groups/${groupId}/posts?userId=${currentUser.id}`,
        { postId: post.id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.alreadyShared) {
        setAlert({ isOpen: true, type: 'warning', message: 'This post is already shared in the selected group.' });
      } else {
        setAlert({ isOpen: true, type: 'success', message: 'Post shared successfully!' });
      }

      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to share post';
      setAlert({ isOpen: true, type: 'error', message: errorMessage });
      setShowShareModal(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!userId) return;

    const previousLikeState = isLiked;
    const previousCount = localLikeCount;

    try {
      setIsLiked(!isLiked);
      setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);

      const endpoint = `http://localhost:8081/api/posts/${post.id}/like?userId=${userId}`;
      const response = await (isLiked ?
        axios.delete(endpoint) :
        axios.post(endpoint)
      );

      // Update the like count from the response
      if (response.data && typeof response.data.likeCount === 'number') {
        setLocalLikeCount(response.data.likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic updates on error
      setIsLiked(previousLikeState);
      setLocalLikeCount(previousCount);

      if (error.response?.status !== 500) {
        const errorMessage = error.response?.data?.message || 'Failed to update like status';
        console.warn(errorMessage);
      }
    }
  };

  // Update this effect to correctly fetch user groups when the modal opens
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!currentUser) return;
      try {
        const token = localStorage.getItem('skillshare_token');
        const response = await axios.get(
          `http://localhost:8081/api/groups/user/${currentUser.id}/all`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        console.log('Fetched all user groups:', response.data);
        setUserGroups(response.data);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    if (showShareModal) {
      fetchUserGroups();
    }
  }, [currentUser, showShareModal]);

  // Share modal with increased contrast and black text for better visibility
  const renderShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Share to Group</h2>
        {userGroups.length === 0 ? (
          <p className="text-gray-700 font-medium">You haven't joined any groups yet.</p>
        ) : (
          <div className="space-y-3">
            {userGroups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 bg-white shadow-sm"
                onClick={() => handleShareToGroup(group.id)}
              >
                <h3 className="font-bold text-gray-800 text-lg">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
                {group.ownerId === currentUser?.id && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    You own this group
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowShareModal(false)}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200 rounded-lg"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-gray-800 border border-gray-100 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
          <div className="h-4 bg-gray-200 rounded-full w-full"></div>
          <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 mb-6 text-gray-800 border border-gray-100 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    >
      <Alert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.type === 'success' ? 'Success' : alert.type === 'error' ? 'Error' : 'Info'}
        message={alert.message}
        onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
      />
      {isEditing ? (
        <PostForm
          initialData={post}
          isEditing={true}
          onPostCreated={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                {authorName ? authorName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  Posted by {authorName || 'Anonymous'} • 
                  {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userId && userId !== post.userId && (
                <FollowButton userId={post.userId} followerId={userId} />
              )}
              {isOwner && currentUser && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post content */}
          <div className="mb-4">
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className={`grid ${post.imageUrls.length === 1 ? 'grid-cols-1' : post.imageUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mb-4`}>
                {post.imageUrls.map((url, index) => (
                  <div key={index} className="overflow-hidden rounded-lg group">
                    <img
                      key={index}
                      src={`http://localhost:8081${url}`}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
            {renderVideo()}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>

          {/* Post actions */}
          <div className="flex justify-between items-center border-t border-b border-gray-100 py-2 my-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLikeToggle}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                isLiked
                  ? 'bg-red-50 text-red-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart 
                size={18} 
                className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
              {localLikeCount} {localLikeCount === 1 ? 'Like' : 'Likes'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 text-gray-600 hover:bg-gray-50"
            >
              <Share2 size={18} className="text-gray-400" />
              Share
            </motion.button>
            
            {!detailed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleComments}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 text-gray-600 hover:bg-gray-50"
              >
                <MessageCircle size={18} className="text-gray-400" />
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </motion.button>
            )}

            {!detailed && (
              <Link
                to={`/post/${post.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 text-blue-500 hover:bg-blue-50"
              >
                <ExternalLink size={18} />
                View Details
              </Link>
            )}
          </div>

          {/* Comments section */}
          {showComments && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <CommentForm
                postId={post.id}
                userId={userId}
                onCommentAdded={handleCommentAdded}
              />

              <CommentList
                postId={post.id}
                userId={userId}
                initialComments={comments}
              />
            </motion.div>
          )}

          {showShareModal && renderShareModal()}
        </>
      )}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Confirm Deletion"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </motion.div>
  );
};

export default PostCard;