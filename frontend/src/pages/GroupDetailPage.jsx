// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PostCard from '../components/PostCard';
// import { useUser } from '../contexts/UserContext';
// import ConfirmationModal from '../components/ConfirmationModal';
// import Alert from '../components/Alert';

// const GroupDetailPage = () => {
//   const { groupId } = useParams();
//   const navigate = useNavigate();
//   const [group, setGroup] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const { currentUser } = useUser();
  
//   const [editForm, setEditForm] = useState({
//     name: '',
//     description: '',
//     isPublic: true  // Match the property name in the backend
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
//   const [modalConfig, setModalConfig] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     action: null,
//     type: null
//   });

//   const openModal = (postId) => {
//     setSelectedPostId(postId);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedPostId(null);
//     setIsModalOpen(false);
//   };

//   const handleConfirmRemovePost = async () => {
//     if (!selectedPostId) return;

//     try {
//       const token = localStorage.getItem('skillshare_token');
//       await axios.delete(
//         `http://localhost:8081/api/groups/${groupId}/posts/${selectedPostId}?userId=${currentUser.id}`,
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );

//       setPosts(posts.filter(post => post.id !== selectedPostId));
//       setAlert({ isOpen: true, type: 'success', message: 'Post removed from group successfully!' });
//     } catch (error) {
//       console.error('Error removing post:', error);
//       setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to remove post' });
//     } finally {
//       closeModal();
//     }
//   };

//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       try {
//         const token = localStorage.getItem('skillshare_token');
//         const [groupResponse, postsResponse, membersResponse] = await Promise.all([
//           axios.get(`http://localhost:8081/api/groups/${groupId}`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           axios.get(`http://localhost:8081/api/groups/${groupId}/posts`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           axios.get(`http://localhost:8081/api/groups/${groupId}/members`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         ]);

//         setGroup(groupResponse.data);
//         setPosts(postsResponse.data);
//         setMembers(membersResponse.data);
        
//         // Initialize form with correct field names
//         setEditForm({
//           name: groupResponse.data.name || '',
//           description: groupResponse.data.description || '',
//           isPublic: groupResponse.data.isPublic || true  // Match the property name
//         });
//       } catch (error) {
//         console.error('Error fetching group details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroupDetails();
//   }, [groupId]);

//   const isOwner = currentUser?.id === group?.ownerId;

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.put(
//         `http://localhost:8081/api/groups/${groupId}?userId=${currentUser.id}`,
//         editForm,
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );
      
//       setGroup(response.data);
//       setIsEditing(false);
//       alert('Group updated successfully!');
//     } catch (error) {
//       console.error('Error updating group:', error);
//       alert(error.response?.data?.message || 'Failed to update group');
//     }
//   };

//   const handleDeleteGroup = () => {
//     setModalConfig({
//       isOpen: true,
//       title: 'Delete Group',
//       message: 'Are you sure you want to delete this group? This action cannot be undone.',
//       action: async () => {
//         try {
//           const token = localStorage.getItem('skillshare_token');
//           await axios.delete(
//             `http://localhost:8081/api/groups/${groupId}?userId=${currentUser.id}`,
//             { headers: { 'Authorization': `Bearer ${token}` } }
//           );
//           setAlert({ isOpen: true, type: 'success', message: 'Group deleted successfully!' });
//           navigate('/groups');
//         } catch (error) {
//           console.error('Error deleting group:', error);
//           setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to delete group' });
//         }
//       },
//       type: 'delete'
//     });
//   };

//   const handleRemoveMember = (memberId) => {
//     setModalConfig({
//       isOpen: true,
//       title: 'Remove Member',
//       message: 'Are you sure you want to remove this member from the group?',
//       action: async () => {
//         try {
//           const token = localStorage.getItem('skillshare_token');
//           await axios.delete(
//             `http://localhost:8081/api/groups/${groupId}/members/${memberId}?userId=${currentUser.id}`,
//             { headers: { 'Authorization': `Bearer ${token}` } }
//           );
//           setMembers(members.filter(member => member.id !== memberId));
//           setAlert({ isOpen: true, type: 'success', message: 'Member removed successfully!' });
//         } catch (error) {
//           console.error('Error removing member:', error);
//           setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to remove member' });
//         }
//       },
//       type: 'remove'
//     });
//   };

//   const handleConfirmAction = async () => {
//     if (modalConfig.action) {
//       await modalConfig.action();
//     }
//     setModalConfig({ isOpen: false, title: '', message: '', action: null, type: null });
//   };

//   const handleCancelAction = () => {
//     setModalConfig({ isOpen: false, title: '', message: '', action: null, type: null });
//   };

//   if (loading) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Alert
//         isOpen={alert.isOpen}
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
//       />
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h1 className="text-2xl font-bold mb-2 text-black">{group?.name}</h1>
//         <p className="text-gray-700">{group?.description}</p>
        
//         {isOwner && (
//           <div className="mt-4 flex justify-end space-x-3">
//             {isEditing ? (
//               <form onSubmit={handleEditSubmit} className="w-full">
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
//                   <input
//                     type="text"
//                     value={editForm.name}
//                     onChange={(e) => setEditForm({...editForm, name: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded text-black"
//                     required
//                   />
//                 </div>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={editForm.description}
//                     onChange={(e) => setEditForm({...editForm, description: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded text-black"
//                     rows="3"
//                   />
//                 </div>
                
//                 <div className="mb-4 flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={editForm.isPublic}
//                     onChange={(e) => setEditForm({...editForm, isPublic: e.target.checked})}
//                     className="mr-2"
//                   />
//                   <label className="text-sm text-gray-700">Public Group</label>
//                 </div>
                
//                 <div className="flex justify-end space-x-2">
//                   <span 
//                     onClick={() => setIsEditing(false)}
//                     className="px-4 py-2 border border-gray-300 rounded text-gray-700 cursor-pointer hover:bg-gray-100"
//                   >
//                     Cancel
//                   </span>
//                   <button 
//                     type="submit"
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Edit Group
//                 </button>
//                 <button
//                   onClick={handleDeleteGroup}
//                   className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded hover:from-red-600 hover:to-red-800"
//                 >
//                   Delete Group
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {isOwner && !isEditing && (
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <h2 className="text-xl font-bold mb-4 text-black">Group Management</h2>

//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-black mb-2">Members ({members.length})</h3>
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {members.map((member) => (
//                 <div key={member.id} className="flex justify-between items-center p-2 border-b">
//                   <div className="text-black">
//                     {member.fullName || member.username}
//                     {member.id === group.ownerId && (
//                       <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Owner</span>
//                     )}
//                   </div>
//                   {member.id !== group.ownerId && (
//                     <button
//                       onClick={() => handleRemoveMember(member.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <h2 className="text-xl font-bold my-6 text-white">Posts</h2>
//       {posts.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-6 text-center">
//           <p className="text-gray-600">No posts have been shared in this group yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {posts.map(post => (
//             <div key={post.id} className="relative">
//               {isOwner && (
//                 <div className="max-w-2xl mx-auto justify-end flex space-x-2 pr-4">
//                   <span
//                     onClick={() => openModal(post.id)}
//                     className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 font-semibold cursor-pointer hover:underline"
//                   >
//                     Remove Post
//                   </span>
//                 </div>
//               )}
//               <PostCard 
//                 post={post} 
//                 userId={currentUser?.id}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       <ConfirmationModal
//         isOpen={modalConfig.isOpen}
//         title={modalConfig.title}
//         message={modalConfig.message}
//         onConfirm={handleConfirmAction}
//         onCancel={handleCancelAction}
//         type={modalConfig.type}
//       />
//     </div>
//   );
// };

// export default GroupDetailPage;









import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useUser } from '../contexts/UserContext';
import ConfirmationModal from '../components/ConfirmationModal';
import Alert from '../components/Alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Settings, Edit3, Trash2, Globe, Lock, X } from 'lucide-react';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useUser();
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    type: null
  });

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const token = localStorage.getItem('skillshare_token');
        const [groupResponse, postsResponse, membersResponse] = await Promise.all([
          axios.get(`http://localhost:8081/api/groups/${groupId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8081/api/groups/${groupId}/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8081/api/groups/${groupId}/members`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setGroup(groupResponse.data);
        setPosts(postsResponse.data);
        setMembers(membersResponse.data);
        
        setEditForm({
          name: groupResponse.data.name || '',
          description: groupResponse.data.description || '',
          isPublic: groupResponse.data.isPublic || true
        });
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const isOwner = currentUser?.id === group?.ownerId;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.put(
        `http://localhost:8081/api/groups/${groupId}?userId=${currentUser.id}`,
        editForm,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setGroup(response.data);
      setIsEditing(false);
      setAlert({
        isOpen: true,
        type: 'success',
        message: 'Group updated successfully!'
      });
    } catch (error) {
      console.error('Error updating group:', error);
      setAlert({
        isOpen: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update group'
      });
    }
  };

  const handleDeleteGroup = () => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Group',
      message: 'Are you sure you want to delete this group? This action cannot be undone.',
      action: async () => {
        try {
          const token = localStorage.getItem('skillshare_token');
          await axios.delete(
            `http://localhost:8081/api/groups/${groupId}?userId=${currentUser.id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          navigate('/groups');
        } catch (error) {
          console.error('Error deleting group:', error);
          setAlert({
            isOpen: true,
            type: 'error',
            message: error.response?.data?.message || 'Failed to delete group'
          });
        }
      },
      type: 'delete'
    });
  };

  const handleRemoveMember = (memberId) => {
    setModalConfig({
      isOpen: true,
      title: 'Remove Member',
      message: 'Are you sure you want to remove this member from the group?',
      action: async () => {
        try {
          const token = localStorage.getItem('skillshare_token');
          await axios.delete(
            `http://localhost:8081/api/groups/${groupId}/members/${memberId}?userId=${currentUser.id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          setMembers(members.filter(member => member.id !== memberId));
          setAlert({
            isOpen: true,
            type: 'success',
            message: 'Member removed successfully!'
          });
        } catch (error) {
          console.error('Error removing member:', error);
          setAlert({
            isOpen: true,
            type: 'error',
            message: error.response?.data?.message || 'Failed to remove member'
          });
        }
      },
      type: 'remove'
    });
  };

  const handleConfirmAction = async () => {
    if (modalConfig.action) {
      await modalConfig.action();
    }
    setModalConfig({ isOpen: false, title: '', message: '', action: null, type: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-12 pb-16 px-4">
        <div className="flex items-center justify-center min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-block h-16 w-16 relative">
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-teal-400 border-l-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-teal-500 animate-spin animate-reverse"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Loading group details...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 ">
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-12 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Alert
          isOpen={alert.isOpen}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-xl font-bold">
                  {group?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{group?.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{members.length} members</span>
                    {group?.isPublic ? (
                      <div className="flex items-center gap-1 text-blue-500">
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isOwner && !isEditing && (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-200 flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteGroup}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </motion.button>
                </div>
              )}
            </div>

            {isEditing ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleEditSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows="4"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isPublic}
                    onChange={(e) => setEditForm({...editForm, isPublic: e.target.checked})}
                    className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700 flex items-center gap-2">
                    {editForm.isPublic ? (
                      <Globe className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-500" />
                    )}
                    {editForm.isPublic ? 'Public Group' : 'Private Group'}
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-200"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <p className="text-gray-600">{group?.description}</p>
            )}
          </div>
        </motion.div>

        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800">Group Management</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                
                    Members ({members.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto rounded-lg border border-gray-100">
                    <AnimatePresence>
                      {members.map((member) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                              {(member.fullName || member.username).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-gray-800 font-medium">
                                {member.fullName || member.username}
                              </span>
                              {member.id === group.ownerId && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                  Owner
                                </span>
                              )}
                            </div>
                          </div>
                          {member.id !== group.ownerId && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                            >
                              <X className="h-5 w-5" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Posts
          </h2>

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                <Users size={24} />
              </div>
              <p className="text-gray-600 font-medium">No posts have been shared in this group yet.</p>
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
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-6"
            >
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <PostCard 
                    post={post} 
                    userId={currentUser?.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalConfig({ isOpen: false, title: '', message: '', action: null, type: null })}
        type={modalConfig.type}
      />
    </div>
    </div>
  );
};

export default GroupDetailPage;