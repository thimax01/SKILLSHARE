import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, activeTab]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const endpoint = activeTab === 'unread'
        ? `http://localhost:8081/api/notifications/user/${currentUser.id}/unread`
        : `http://localhost:8081/api/notifications/user/${currentUser.id}`;
        
      const response = await axios.get(endpoint);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8081/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8081/api/notifications/${notificationId}/unread`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: false } : n
      ));
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:8081/api/notifications/user/${currentUser.id}/read-all`);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8081/api/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate to related content if available
    if (notification.relatedItemId) {
      if (notification.type === 'COMMENT' || notification.type === 'LIKE' || notification.type === 'MENTION') {
        navigate(`/post/${notification.relatedItemId}`);
      } else if (notification.type === 'FOLLOW') {
        navigate(`/profile/${notification.relatedItemId}`);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return (
          <div className="p-2 rounded-full bg-pink-100 text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
        );
      case 'COMMENT':
        return (
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'MENTION':
        return (
          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'FOLLOW':
        return (
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to view your notifications</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-facebook-card shadow-lg rounded-lg overflow-hidden text-facebook-text-primary border border-facebook-divider">
        <div className="bg-gradient-to-r from-facebook-primary to-facebook-hover px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-white/80">Stay updated with your latest activities</p>
        </div>
        
        <div className="flex border-b border-facebook-divider">
          <span 
            className={`flex-1 py-3 px-4 font-medium text-center cursor-pointer ${
              activeTab === 'all' 
                ? 'text-facebook-primary border-b-2 border-facebook-primary' 
                : 'text-facebook-text-secondary hover:text-facebook-text-primary'
            }`} 
            onClick={() => setActiveTab('all')}
          >
            All
          </span>
          <span 
            className={`flex-1 py-3 px-4 font-medium text-center cursor-pointer ${
              activeTab === 'unread' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </span>
        </div>
        
        <div className="px-6 py-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium text-gray-800">Your Notifications</h2>
          <span 
            onClick={handleMarkAllAsRead}
            className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-800 transition duration-300"
          >
            Mark all as read
          </span>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="mt-4">No {activeTab === 'unread' ? 'unread ' : ''}notifications found</p>
            </div>
          ) : (
            <ul>
              {notifications.map(notification => (
                <li key={notification.id} className={`p-6 hover:bg-gray-50 ${notification.read ? '' : 'bg-indigo-50'}`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getNotificationTypeIcon(notification.type)}
                    </div>
                    
                    <div 
                      className="ml-4 flex-grow cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="font-medium text-gray-900">{notification.title}</div>
                      <div className="text-gray-600">{notification.message}</div>
                      <div className="text-sm text-gray-500 mt-1">{formatDate(notification.createdAt)}</div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4 space-x-2">
                      {notification.read ? (
                        <button 
                          onClick={() => handleMarkAsUnread(notification.id)}
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:text-gray-900 transition duration-300"
                        >
                          Mark as unread
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300"
                        >
                          Mark as read
                        </button>
                      )}
                      <span 
                        onClick={() => handleDelete(notification.id)}
                        className="px-3 py-1 text-sm text-white rounded bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 transition duration-300 cursor-pointer"
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
