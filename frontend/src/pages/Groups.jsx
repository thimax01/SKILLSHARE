// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useUser } from '../contexts/UserContext';
// import { Link } from 'react-router-dom';

// const Groups = () => {
//   const [groups, setGroups] = useState([]);
//   const [userGroups, setUserGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { currentUser } = useUser();
  
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newGroup, setNewGroup] = useState({
//     name: '',
//     description: '',
//     isPublic: true
//   });

//   useEffect(() => {
//     fetchGroups();
//     if (currentUser) {
//       fetchUserGroups();
//     }
//   }, [currentUser]);

//   const fetchGroups = async () => {
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.get('http://localhost:8081/api/groups', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (response.data) {
//         setGroups(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserGroups = async () => {
//     if (!currentUser) return;
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.get(`http://localhost:8081/api/groups/user/${currentUser.id}/all`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (response.data) {
//         console.log("User's groups:", response.data);
//         setUserGroups(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching user groups:', error);
//       alert('Error loading your groups. Please refresh the page.');
//     }
//   };

//   const handleCreateGroup = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.post(
//         'http://localhost:8081/api/groups',
//         {
//           ...newGroup,
//           ownerId: currentUser.id
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       if (response.data) {
//         setShowCreateForm(false);
//         fetchGroups();
//         // Show success message
//         alert('Group created successfully!');
//       }
//     } catch (error) {
//       console.error('Error creating group:', error);
//       alert(error.response?.data?.message || 'Failed to create group. Please try again.');
//     }
//   };

//   const handleJoinGroup = async (groupId) => {
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       const response = await axios.post(
//         `http://localhost:8081/api/groups/${groupId}/join?userId=${currentUser.id}`,
//         {},
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       // If successful, add the group to userGroups immediately
//       if (response.data) {
//         // Find the joined group in the groups array
//         const joinedGroup = groups.find(g => g.id === groupId);
//         if (joinedGroup) {
//           setUserGroups(prevGroups => [...prevGroups, joinedGroup]);
//         }
//       }
      
//       // Then refresh both lists from server
//       fetchGroups();
//       fetchUserGroups();
      
//     } catch (error) {
//       console.error('Error joining group:', error);
//       alert(error.response?.data?.message || 'Failed to join group. Please try again.');
//     }
//   };

//   const handleLeaveGroup = async (groupId) => {
//     try {
//       const token = localStorage.getItem('skillshare_token');
//       await axios.delete(
//         `http://localhost:8081/api/groups/${groupId}/leave?userId=${currentUser.id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       // Update both groups and userGroups state immediately without waiting for the fetch
//       setUserGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      
//       // Then refresh from server
//       fetchGroups();
//       fetchUserGroups();
      
//     } catch (error) {
//       console.error('Error leaving group:', error);
//       alert(error.response?.data?.message || 'Failed to leave group. Please try again.');
//     }
//   };

//   if (!currentUser) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <p className="text-center text-gray-600">Please log in to view groups</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Groups</h1>
//         <button
//           onClick={() => setShowCreateForm(true)}
//           className="bg-facebook-primary text-white px-4 py-2 rounded-md hover:bg-facebook-hover"
//         >
//           Create Group
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-facebook-primary"></div>
//         </div>
//       ) : groups.length === 0 ? (
//         <div className="text-center text-gray-600 py-8">
//           <p>No groups found. Create one to get started!</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {groups.map(group => (
//             <div key={group.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
//               <Link to={`/groups/${group.id}`}>
//                 <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
//               </Link>
//               <p className="text-gray-600 mb-4">{group.description}</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-500">
//                   {group.memberCount} members
//                 </span>
                
//                 {/* Check if user is a member or owner of this group */}
//                 {group.ownerId === currentUser.id ? (
//                   <span className="px-4 py-2 bg-green-100 text-green-800 rounded">Owner</span>
//                 ) : userGroups.some(g => g.id === group.id) ? (
//                   <button
//                     onClick={() => handleLeaveGroup(group.id)}
//                     className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
//                   >
//                     Leave
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleJoinGroup(group.id)}
//                     className="px-4 py-2 bg-facebook-primary text-white rounded hover:bg-facebook-hover"
//                   >
//                     Join
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showCreateForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Create New Group</h2>
//             <form onSubmit={handleCreateGroup}>
//               <input
//                 type="text"
//                 placeholder="Group Name"
//                 className="w-full mb-4 p-2 border rounded"
//                 value={newGroup.name}
//                 onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
//               />
//               <textarea
//                 placeholder="Description"
//                 className="w-full mb-4 p-2 border rounded"
//                 value={newGroup.description}
//                 onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
//               />
//               <div className="flex items-center mb-4">
//                 <input
//                   type="checkbox"
//                   checked={newGroup.isPublic}
//                   onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
//                   className="mr-2"
//                 />
//                 <label>Public Group</label>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <span
//                   type="button"
//                   onClick={() => setShowCreateForm(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </span>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-facebook-primary text-white rounded hover:bg-facebook-hover"
//                 >
//                   Create
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Groups;






// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useUser } from '../contexts/UserContext';
// // import { Link } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Users, Plus, Globe, Lock, UserPlus, LogOut, Sparkles } from 'lucide-react';

// // const Groups = () => {
// //   const [groups, setGroups] = useState([]);
// //   const [userGroups, setUserGroups] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const { currentUser } = useUser();
  
// //   const [showCreateForm, setShowCreateForm] = useState(false);
// //   const [newGroup, setNewGroup] = useState({
// //     name: '',
// //     description: '',
// //     isPublic: true
// //   });

// //   useEffect(() => {
// //     fetchGroups();
// //     if (currentUser) {
// //       fetchUserGroups();
// //     }
// //   }, [currentUser]);

// //   const fetchGroups = async () => {
// //     try {
// //       const token = localStorage.getItem('skillshare_token');
// //       const response = await axios.get('http://localhost:8081/api/groups', {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });
// //       if (response.data) {
// //         setGroups(response.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching groups:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchUserGroups = async () => {
// //     if (!currentUser) return;
// //     try {
// //       const token = localStorage.getItem('skillshare_token');
// //       const response = await axios.get(`http://localhost:8081/api/groups/user/${currentUser.id}/all`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });
// //       if (response.data) {
// //         setUserGroups(response.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching user groups:', error);
// //     }
// //   };

// //   const handleCreateGroup = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const token = localStorage.getItem('skillshare_token');
// //       const response = await axios.post(
// //         'http://localhost:8081/api/groups',
// //         {
// //           ...newGroup,
// //           ownerId: currentUser.id
// //         },
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );
      
// //       if (response.data) {
// //         setShowCreateForm(false);
// //         fetchGroups();
// //         setNewGroup({ name: '', description: '', isPublic: true });
// //       }
// //     } catch (error) {
// //       console.error('Error creating group:', error);
// //     }
// //   };

// //   const handleJoinGroup = async (groupId) => {
// //     try {
// //       const token = localStorage.getItem('skillshare_token');
// //       await axios.post(
// //         `http://localhost:8081/api/groups/${groupId}/join?userId=${currentUser.id}`,
// //         {},
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );
      
// //       fetchGroups();
// //       fetchUserGroups();
// //     } catch (error) {
// //       console.error('Error joining group:', error);
// //     }
// //   };

// //   const handleLeaveGroup = async (groupId) => {
// //     try {
// //       const token = localStorage.getItem('skillshare_token');
// //       await axios.delete(
// //         `http://localhost:8081/api/groups/${groupId}/leave?userId=${currentUser.id}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );
      
// //       setUserGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
// //       fetchGroups();
// //     } catch (error) {
// //       console.error('Error leaving group:', error);
// //     }
// //   };

// //   if (!currentUser) {
// //     return (
      
// //       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-12 pb-16 px-4">
// //         <div className="max-w-md mx-auto text-center">
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="bg-white p-8 rounded-xl shadow-md"
// //           >
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4">Join SkillShare Groups</h2>
// //             <p className="text-gray-600">Please log in to view and join groups.</p>
// //           </motion.div>
// //         </div>
// //       </div>
      
// //     );
// //   }

// //   return (
// //     <div className="pt-16 ">
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-12 pb-16 px-4">
// //       <div className="max-w-6xl mx-auto">
// //         <motion.div
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="text-center mb-12"
// //         >
// //           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 inline-flex items-center gap-3 mb-4">
// //             <Sparkles className="h-8 w-8 text-blue-500" />
// //             <span>Groups</span>
// //           </h1>
// //           <p className="text-gray-600 max-w-2xl mx-auto">
// //             Join groups to connect with others, share knowledge, and grow together
// //           </p>
// //         </motion.div>

// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="flex justify-end mb-8"
// //         >
// //           <motion.button
// //             whileHover={{ scale: 1.02 }}
// //             whileTap={{ scale: 0.98 }}
// //             onClick={() => setShowCreateForm(true)}
// //             className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl hover:from-blue-600 hover:to-teal-500 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
// //           >
// //             <Plus className="h-5 w-5" />
// //             Create Group
// //           </motion.button>
// //         </motion.div>

// //         {loading ? (
// //           <div className="flex items-center justify-center min-h-[50vh]">
// //             <motion.div
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="text-center"
// //             >
// //               <div className="inline-block h-16 w-16 relative">
// //                 <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-teal-400 border-l-transparent animate-spin"></div>
// //                 <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-teal-500 animate-spin animate-reverse"></div>
// //               </div>
// //               <p className="mt-4 text-gray-500 font-medium">Loading groups...</p>
// //             </motion.div>
// //           </div>
// //         ) : groups.length === 0 ? (
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="bg-white p-8 rounded-xl shadow-md text-center max-w-md mx-auto"
// //           >
// //             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
// //               <Users size={24} />
// //             </div>
// //             <p className="text-gray-600 font-medium">No groups available. Create one to get started!</p>
// //           </motion.div>
// //         ) : (
// //           <motion.div
// //             initial="hidden"
// //             animate="visible"
// //             variants={{
// //               hidden: { opacity: 0 },
// //               visible: {
// //                 opacity: 1,
// //                 transition: {
// //                   staggerChildren: 0.1
// //                 }
// //               }
// //             }}
// //             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
// //           >
// //             {groups.map(group => (
// //               <motion.div
// //                 key={group.id}
// //                 variants={{
// //                   hidden: { opacity: 0, y: 20 },
// //                   visible: { opacity: 1, y: 0 }
// //                 }}
// //                 whileHover={{ y: -4 }}
// //                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
// //               >
// //                 <div className="p-6">
// //                   <div className="flex items-start justify-between mb-4">
// //                     <Link 
// //                       to={`/groups/${group.id}`}
// //                       className="hover:text-blue-600 transition-colors duration-200"
// //                     >
// //                       <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.name}</h3>
// //                     </Link>
// //                     {group.isPublic ? (
// //                       <Globe className="h-5 w-5 text-blue-500" />
// //                     ) : (
// //                       <Lock className="h-5 w-5 text-gray-500" />
// //                     )}
// //                   </div>
                  
// //                   <p className="text-gray-600 mb-6 line-clamp-2">{group.description}</p>
                  
// //                   <div className="flex items-center justify-between">
// //                     <div className="flex items-center text-gray-500">
// //                       <Users className="h-5 w-5 mr-2" />
// //                       <span className="text-sm">{group.memberCount} members</span>
// //                     </div>
                    
// //                     {group.ownerId === currentUser.id ? (
// //                       <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
// //                         Owner
// //                       </span>
// //                     ) : userGroups.some(g => g.id === group.id) ? (
// //                       <motion.button
// //                         whileHover={{ scale: 1.02 }}
// //                         whileTap={{ scale: 0.98 }}
// //                         onClick={() => handleLeaveGroup(group.id)}
// //                         className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
// //                       >
// //                         <LogOut className="h-4 w-4" />
// //                         Leave
// //                       </motion.button>
// //                     ) : (
// //                       <motion.button
// //                         whileHover={{ scale: 1.02 }}
// //                         whileTap={{ scale: 0.98 }}
// //                         onClick={() => handleJoinGroup(group.id)}
// //                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-200 text-sm font-medium"
// //                       >
// //                         <UserPlus className="h-4 w-4" />
// //                         Join
// //                       </motion.button>
// //                     )}
// //                   </div>
// //                 </div>
// //               </motion.div>
// //             ))}
// //           </motion.div>
// //         )}
// //       </div>

// //       <AnimatePresence>
// //         {showCreateForm && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
// //           >
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.9 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.9 }}
// //               className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
// //             >
// //               <div className="flex justify-between items-center mb-6">
// //                 <h2 className="text-2xl font-bold text-gray-800">Create New Group</h2>
// //                 <button
// //                   onClick={() => setShowCreateForm(false)}
// //                   className="text-gray-500 hover:text-gray-700"
// //                 >
// //                   <X className="h-6 w-6" />
// //                 </button>
// //               </div>

// //               <form onSubmit={handleCreateGroup} className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Group Name
// //                   </label>
// //                   <input
// //                     type="text"
// //                     placeholder="Enter group name"
// //                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
// //                     value={newGroup.name}
// //                     onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Description
// //                   </label>
// //                   <textarea
// //                     placeholder="Describe your group"
// //                     className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
// //                     rows="4"
// //                     value={newGroup.description}
// //                     onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
// //                     required
// //                   />
// //                 </div>

// //                 <div className="flex items-center gap-2">
// //                   <input
// //                     type="checkbox"
// //                     checked={newGroup.isPublic}
// //                     onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
// //                     className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
// //                   />
// //                   <label className="text-sm text-gray-700 flex items-center gap-2">
// //                     {newGroup.isPublic ? (
// //                       <Globe className="h-4 w-4 text-blue-500" />
// //                     ) : (
// //                       <Lock className="h-4 w-4 text-gray-500" />
// //                     )}
// //                     {newGroup.isPublic ? 'Public Group' : 'Private Group'}
// //                   </label>
// //                 </div>

// //                 <div className="flex justify-end gap-3 pt-4">
// //                   <motion.button
// //                     whileHover={{ scale: 1.02 }}
// //                     whileTap={{ scale: 0.98 }}
// //                     type="button"
// //                     onClick={() => setShowCreateForm(false)}
// //                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
// //                   >
// //                     Cancel
// //                   </motion.button>
// //                   <motion.button
// //                     whileHover={{ scale: 1.02 }}
// //                     whileTap={{ scale: 0.98 }}
// //                     type="submit"
// //                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-200"
// //                   >
// //                     Create Group
// //                   </motion.button>
// //                 </div>
// //               </form>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //     </div>
// //   );
// // };

// // export default Groups;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Lock, Globe, Plus, X } from 'lucide-react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  useEffect(() => {
    fetchGroups();
    if (currentUser) {
      fetchUserGroups();
    }
  }, [currentUser]);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.get('http://localhost:8081/api/groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGroups = async () => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.get(`http://localhost:8081/api/groups/user/${currentUser.id}/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        console.log("User's groups:", response.data);
        setUserGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
      alert('Error loading your groups. Please refresh the page.');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.post(
        'http://localhost:8081/api/groups',
        {
          ...newGroup,
          ownerId: currentUser.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setShowCreateForm(false);
        fetchGroups();
        fetchUserGroups();
        setNewGroup({ name: '', description: '', isPublic: true });
        // Show success message
        alert('Group created successfully!');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert(error.response?.data?.message || 'Failed to create group. Please try again.');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.post(
        `http://localhost:8081/api/groups/${groupId}/join?userId=${currentUser.id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // If successful, add the group to userGroups immediately
      if (response.data) {
        // Find the joined group in the groups array
        const joinedGroup = groups.find(g => g.id === groupId);
        if (joinedGroup) {
          setUserGroups(prevGroups => [...prevGroups, joinedGroup]);
        }
      }
      
      // Then refresh both lists from server
      fetchGroups();
      fetchUserGroups();
      
    } catch (error) {
      console.error('Error joining group:', error);
      alert(error.response?.data?.message || 'Failed to join group. Please try again.');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('skillshare_token');
      await axios.delete(
        `http://localhost:8081/api/groups/${groupId}/leave?userId=${currentUser.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update both groups and userGroups state immediately without waiting for the fetch
      setUserGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      
      // Then refresh from server
      fetchGroups();
      fetchUserGroups();
      
    } catch (error) {
      console.error('Error leaving group:', error);
      alert(error.response?.data?.message || 'Failed to leave group. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Join the Community</h2>
          <p className="text-gray-600 mb-6">Please log in to discover and join groups of like-minded individuals.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-200 transform hover:scale-105">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Groups</h1>
          <p className="text-gray-600 mt-1">Connect, collaborate, and learn together</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <Plus size={18} /> Create Group
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4 flex justify-center">
            <Users size={64} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Groups Found</h2>
          <p className="text-gray-600 mb-6">Create a group to start connecting with others</p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-200"
          >
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => {
            const isOwner = group.ownerId === currentUser.id;
            const isMember = userGroups.some(g => g.id === group.id);
            
            return (
              <div 
                key={group.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Link to={`/groups/${group.id}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-500">{group.name}</h3>
                    </Link>
                    <div className="flex items-center">
                      {group.isPublic ? 
                        <Globe size={16} className="text-green-500" /> : 
                        <Lock size={16} className="text-amber-500" />
                      }
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{group.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={16} className="mr-1" />
                      <span>{group.memberCount || 0} members</span>
                    </div>
                    
                    {isOwner ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Owner</span>
                    ) : isMember ? (
                      <button
                        onClick={() => handleLeaveGroup(group.id)}
                        className="px-4 py-1.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        <UserPlus size={14} /> Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Create New Group</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="group-name">
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  placeholder="Enter a name for your group"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="group-description">
                  Description
                </label>
                <textarea
                  id="group-description"
                  placeholder="What is this group about?"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px]"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative inline-block w-10 mr-2 align-middle">
                    <input 
                      type="checkbox" 
                      id="toggle" 
                      className="sr-only peer"
                      checked={newGroup.isPublic}
                      onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Public Group</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-12">
                  {newGroup.isPublic ? 
                    "Anyone can find and join this group" : 
                    "Only invited members can join this group"}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;