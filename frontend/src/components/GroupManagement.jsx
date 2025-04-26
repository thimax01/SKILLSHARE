import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';

const GroupManagement = ({ group, currentUser, onUpdate }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: group?.name || '',
    description: group?.description || '',
    isPublic: group?.isPublic || true
  });
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState({ type: null, id: null });

  const isOwner = currentUser?.id === group?.ownerId;

  useEffect(() => {
    if (group) {
      setEditForm({
        name: group.name,
        description: group.description,
        isPublic: group.isPublic
      });
    }
  }, [group]);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!group) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('skillshare_token');

        // Fetch members and posts
        const [membersRes, postsRes] = await Promise.all([
          axios.get(`http://localhost:8081/api/groups/${group.id}/members`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8081/api/groups/${group.id}/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setMembers(membersRes.data || []);
        setPosts(postsRes.data || []);
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [group]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('skillshare_token');
      const response = await axios.put(
        `http://localhost:8081/api/groups/${group.id}?userId=${currentUser.id}`,
        editForm,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setIsEditing(false);
      if (onUpdate) {
        onUpdate(response.data);
      }
      alert('Group updated successfully!');
    } catch (error) {
      console.error('Error updating group:', error);
      alert(error.response?.data?.message || 'Failed to update group');
    }
  };

  const handleDeleteGroup = () => {
    setShowConfirmModal({ type: 'group', id: group.id });
  };

  const handleRemovePost = (postId) => {
    setShowConfirmModal({ type: 'post', id: postId });
  };

  const handleRemoveMember = (memberId) => {
    setShowConfirmModal({ type: 'member', id: memberId });
  };

  const confirmAction = async () => {
    try {
      const token = localStorage.getItem('skillshare_token');
      if (showConfirmModal.type === 'group') {
        await axios.delete(
          `http://localhost:8081/api/groups/${group.id}?userId=${currentUser.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        alert('Group deleted successfully');
        navigate('/groups');
      } else if (showConfirmModal.type === 'post') {
        await axios.delete(
          `http://localhost:8081/api/groups/${group.id}/posts/${showConfirmModal.id}?userId=${currentUser.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setPosts(posts.filter(post => post.id !== showConfirmModal.id));
        alert('Post removed from group');
      } else if (showConfirmModal.type === 'member') {
        await axios.delete(
          `http://localhost:8081/api/groups/${group.id}/members/${showConfirmModal.id}?userId=${currentUser.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMembers(members.filter(member => member.id !== showConfirmModal.id));
        alert('Member removed from group');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert(error.response?.data?.message || 'Failed to perform action');
    } finally {
      setShowConfirmModal({ type: null, id: null });
    }
  };

  if (!isOwner) {
    return null;
  }

  if (loading) {
    return (
      <Alert
        type="info"
        message="Loading group management..."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-xl font-bold mb-4 text-black">Group Management</h2>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-black"
              rows="4"
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

          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6">
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Edit Group
          </button>
          <button 
            onClick={handleDeleteGroup}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Group
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-2">Members ({members.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
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

      <div>
        <h3 className="text-lg font-semibold text-black mb-2">Shared Posts ({posts.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {posts.map((post) => (
            <div key={post.id} className="flex justify-between items-center p-2 border-b">
              <div className="text-black truncate flex-1">{post.title}</div>
              <button
                onClick={() => handleRemovePost(post.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {showConfirmModal.type && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center">Confirm Action</h2>
            <p className="text-gray-600 mb-6 text-center">
              {showConfirmModal.type === 'group' && 'Are you sure you want to delete this group? This action cannot be undone.'}
              {showConfirmModal.type === 'post' && 'Are you sure you want to remove this post from the group?'}
              {showConfirmModal.type === 'member' && 'Are you sure you want to remove this member from the group?'}
            </p>
            <div className="flex justify-end space-x-4">
              <span
                onClick={() => setShowConfirmModal({ type: null, id: null })}
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </span>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
