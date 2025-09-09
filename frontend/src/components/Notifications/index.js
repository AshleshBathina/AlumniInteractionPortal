import React, { Component } from 'react';
import { notificationService } from '../../services/api';
import './index.css';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    this.fetchNotifications();
    this.fetchUnreadCount();
    
    // Set up polling for notifications
    this.notificationInterval = setInterval(() => {
      this.fetchUnreadCount();
    }, 30000); // Check every 30 seconds
  }

  componentWillUnmount() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
  }

  fetchNotifications = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      this.setState({ error: 'Please log in to view notifications' });
      return;
    }

    this.setState({ isLoading: true, error: null });
    try {
      const response = await notificationService.getNotifications();
      this.setState({ notifications: response.data || [], isLoading: false });
    } catch (e) {
      const errorMessage = e.response?.data?.error || 'Failed to load notifications';
      this.setState({ error: errorMessage, isLoading: false });
    }
  };

  fetchUnreadCount = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await notificationService.getUnreadCount();
      this.setState({ unreadCount: response.data.count || 0 });
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
    }
  };

  markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      this.setState(prevState => ({
        notifications: prevState.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, read: 1 } : notif
        ),
        unreadCount: Math.max(0, prevState.unreadCount - 1)
      }));
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      this.setState(prevState => ({
        notifications: prevState.notifications.map(notif => ({ ...notif, read: 1 })),
        unreadCount: 0
      }));
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  };

  deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      this.setState(prevState => ({
        notifications: prevState.notifications.filter(notif => notif.id !== notificationId),
        unreadCount: prevState.notifications.find(n => n.id === notificationId && !n.read) 
          ? Math.max(0, prevState.unreadCount - 1) 
          : prevState.unreadCount
      }));
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }
  };

  render() {
    const { notifications, unreadCount, isLoading, error } = this.state;

    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
          {notifications.length > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={this.markAllAsRead}
            >
              Mark All as Read
            </button>
          )}
        </div>

        {isLoading && (
          <div className="notifications-loading">Loading notifications...</div>
        )}

        {error && (
          <div className="notifications-error">{error}</div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="notifications-empty">
            <p>No notifications yet</p>
            <p>You'll see notifications here when you receive job applications or application updates.</p>
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && this.markAsRead(notification.id)}
              >
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="mark-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.markAsRead(notification.id);
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="delete-notification-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.deleteNotification(notification.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Notifications;
