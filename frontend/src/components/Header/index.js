import React, { Component } from 'react';
import { applicationService, notificationService } from '../../services/api';
import './index.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotificationDropdownOpen: false,
      isApplicationsDropdownOpen: false,
      myApplications: [],
      isLoadingApplications: false,
      appsError: null,
      notifications: [],
      unreadCount: 0,
      isLoadingNotifications: false,
      notificationsError: null
    };
  }

  toggleNotificationDropdown = () => {
    this.setState(prevState => {
      const isOpening = !prevState.isNotificationDropdownOpen;
      if (isOpening) {
        // Fetch notifications when opening the dropdown
        this.fetchNotifications();
      }
      return {
        isNotificationDropdownOpen: isOpening
      };
    });
  }

  toggleApplicationsDropdown = () => {
    this.setState(prevState => ({
      isApplicationsDropdownOpen: !prevState.isApplicationsDropdownOpen
    }));
  }

  componentDidMount() {
    const { user } = this.props;
    if (user?.role === 'student') {
      this.fetchMyApplications();
    }
    // Only fetch unread count on mount, fetch full notifications when dropdown opens
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

  fetchMyApplications = async () => {
    this.setState({ isLoadingApplications: true, appsError: null });
    try {
      const response = await applicationService.getMyApplications();
      this.setState({ myApplications: response.data || [], isLoadingApplications: false });
    } catch (e) {
      this.setState({ appsError: 'Failed to load applications', isLoadingApplications: false });
    }
  }

  fetchNotifications = async () => {
    const { user } = this.props;
    if (!user) {
      console.log('No user found, skipping notifications fetch');
      return;
    }
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No auth token found');
      this.setState({ notificationsError: 'Please log in to view notifications', isLoadingNotifications: false });
      return;
    }
    
    this.setState({ isLoadingNotifications: true, notificationsError: null });
    try {
      console.log('Fetching notifications for user:', user.id);
      const response = await notificationService.getNotifications();
      console.log('Notifications response:', response);
      this.setState({ notifications: response.data || [], isLoadingNotifications: false });
    } catch (e) {
      console.error('Error fetching notifications:', e);
      const errorMessage = e.response?.data?.error || 'Failed to load notifications';
      this.setState({ notificationsError: errorMessage, isLoadingNotifications: false });
    }
  }

  fetchUnreadCount = async () => {
    const { user } = this.props;
    if (!user) {
      return;
    }
    
    try {
      console.log('=== FRONTEND: Fetching unread count ===');
      console.log('User:', user);
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await notificationService.getUnreadCount();
      console.log('Unread count response:', response);
      this.setState({ unreadCount: response.data.count || 0 });
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
      console.error('Error details:', e.response?.data);
    }
  }

  markNotificationAsRead = async (notificationId) => {
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
  }

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
  }

  deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      this.setState(prevState => ({
        notifications: prevState.notifications.filter(notif => notif.id !== notificationId),
        unreadCount: Math.max(0, prevState.unreadCount - 1)
      }));
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }
  }

  getProfileInitial = () => {
    const { user } = this.props;
    return user?.name?.charAt(0).toUpperCase() || 'U';
  }

  render() {
    const { user, onLogout } = this.props;
    const { 
      isNotificationDropdownOpen, 
      isApplicationsDropdownOpen, 
      myApplications, 
      isLoadingApplications, 
      appsError,
      notifications,
      unreadCount,
      isLoadingNotifications,
      notificationsError
    } = this.state;

    return (
      <header className="header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-placeholder">
              <span className="logo-text">AlumniHub</span>
            </div>
          </div>
          {user?.role === 'student' && (
            <div className="applications-container">
              <button 
                className="applications-button"
                onClick={this.toggleApplicationsDropdown}
              >
                My Applications
                {myApplications && myApplications.length > 0 && (
                  <span className="badge">{myApplications.length}</span>
                )}
              </button>
              {isApplicationsDropdownOpen && (
                <div className="applications-dropdown">
                  {isLoadingApplications && (
                    <div className="applications-loading">Loading...</div>
                  )}
                  {appsError && (
                    <div className="applications-error">{appsError}</div>
                  )}
                  {!isLoadingApplications && !appsError && myApplications.length === 0 && (
                    <div className="applications-empty">No applications yet</div>
                  )}
                  {!isLoadingApplications && !appsError && myApplications.map(app => (
                    <div key={app.id} className="application-item">
                      <div className="application-title">{app.job_title}</div>
                      <div className={`application-status ${app.status}`}>{app.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="notifications-container">
            <button 
              className="notification-button"
              onClick={this.toggleNotificationDropdown}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {isNotificationDropdownOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      className="mark-all-read-button"
                      onClick={this.markAllAsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                {isLoadingNotifications && (
                  <div className="notification-loading">Loading...</div>
                )}
                
                {notificationsError && (
                  <div className="notification-error">{notificationsError}</div>
                )}
                
                {!isLoadingNotifications && !notificationsError && notifications.length === 0 && (
                  <div className="notification-empty">No notifications yet</div>
                )}
                
                {!isLoadingNotifications && !notificationsError && notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => !notification.read && this.markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button 
                      className="delete-notification-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.deleteNotification(notification.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-container">
            <div className="profile-circle">
              {this.getProfileInitial()}
            </div>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>

          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>
    );
  }
}

export default Header;
