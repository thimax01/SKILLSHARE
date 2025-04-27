import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useUser } from '../contexts/UserContext';
import ConfirmationModal from '../components/ConfirmationModal';
import Alert from '../components/Alert';

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
    isPublic: true  // Match the property name in the backend
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

  const openModal = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPostId(null);
    setIsModalOpen(false);
  };

  const handleConfirmRemovePost = async () => {
    if (!selectedPostId) return;

    try {
      const token = localStorage.getItem('skillshare_token');
      await axios.delete(
        `http://localhost:8081/api/groups/${groupId}/posts/${selectedPostId}?userId=${currentUser.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setPosts(posts.filter(post => post.id !== selectedPostId));
      setAlert({ isOpen: true, type: 'success', message: 'Post removed from group successfully!' });
    } catch (error) {
      console.error('Error removing post:', error);
      setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to remove post' });
    } finally {
      closeModal();
    }
  };

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
        
        // Initialize form with correct field names
        setEditForm({
          name: groupResponse.data.name || '',
          description: groupResponse.data.description || '',
          isPublic: groupResponse.data.isPublic || true  // Match the property name
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
      alert('Group updated successfully!');
    } catch (error) {
      console.error('Error updating group:', error);
      alert(error.response?.data?.message || 'Failed to update group');
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
          setAlert({ isOpen: true, type: 'success', message: 'Group deleted successfully!' });
          navigate('/groups');
        } catch (error) {
          console.error('Error deleting group:', error);
          setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to delete group' });
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
          setAlert({ isOpen: true, type: 'success', message: 'Member removed successfully!' });
        } catch (error) {
          console.error('Error removing member:', error);
          setAlert({ isOpen: true, type: 'error', message: error.response?.data?.message || 'Failed to remove member' });
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

  const handleCancelAction = () => {
    setModalConfig({ isOpen: false, title: '', message: '', action: null, type: null });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Alert
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
      />
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-black">{group?.name}</h1>
        <p className="text-gray-700">{group?.description}</p>
        
        {isOwner && (
          <div className="mt-4 flex justify-end space-x-3">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="w-full">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    rows="3"
                  />
                </div>
                
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isPublic}
                    onChange={(e) => setEditForm({...editForm, isPublic: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Public Group</label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <span 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    Cancel
                  </span>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Group
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded hover:from-red-600 hover:to-red-800"
                >
                  Delete Group
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isOwner && !isEditing && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">Group Management</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-2">Members ({members.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-2 border-b">
                  <div className="text-black">
                    {member.fullName || member.username}
                    {member.id === group.ownerId && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Owner</span>
                    )}
                  </div>
                  {member.id !== group.ownerId && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold my-6 text-white">Posts</h2>
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No posts have been shared in this group yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="relative">
              {isOwner && (
                <div className="max-w-2xl mx-auto justify-end flex space-x-2 pr-4">
                  <span
                    onClick={() => openModal(post.id)}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 font-semibold cursor-pointer hover:underline"
                  >
                    Remove Post
                  </span>
                </div>
              )}
              <PostCard 
                post={post} 
                userId={currentUser?.id}
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        type={modalConfig.type}
      />
    </div>
  );
};

export default GroupDetailPage;
