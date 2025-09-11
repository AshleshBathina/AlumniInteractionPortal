import React, { Component } from 'react';
import { applicationService, notificationService } from '../../services/api';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // If using npm

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
    this.fetchUnreadCount();
    this.notificationInterval = setInterval(() => {
      this.fetchUnreadCount();
    }, 30000);
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No auth token found');
      this.setState({ notificationsError: 'Please log in to view notifications', isLoadingNotifications: false });
      return;
    }
    this.setState({ isLoadingNotifications: true, notificationsError: null });
    try {
      const response = await notificationService.getNotifications();
      this.setState({ notifications: response.data || [], isLoadingNotifications: false });
    } catch (e) {
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
      const token = localStorage.getItem('token');
      const response = await notificationService.getUnreadCount();
      this.setState({ unreadCount: response.data.count || 0 });
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
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
    const { user, onLogout, onToggleSidebar, isSidebarOpen } = this.props;
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
          {user?.role === 'alumni' && (
            <button className="sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
              <i className="fas fa-bars"></i>
            </button>
          )}
          <div className="logo-container">
            <div className="logo-placeholder">
              <span className="logo-text">AlumniHub</span>
            </div>
          </div>
          {user?.role === 'student' && (
            <div className="applications-container">
              <button className="applications-button" onClick={this.toggleApplicationsDropdown}>
                <i className="fas fa-briefcase"></i> My Applications
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
            <button className="notification-button" onClick={this.toggleNotificationDropdown}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {isNotificationDropdownOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button className="mark-all-read-button" onClick={this.markAllAsRead}>
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
                        {(() => {
                          const iso = (notification.created_at || '').replace(' ', 'T') + 'Z';
                          const dt = new Date(iso);
                          return new Intl.DateTimeFormat('en-IN', {
                            year: 'numeric', month: 'short', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: '2-digit',
                            hour12: true, timeZone: 'Asia/Kolkata'
                          }).format(dt);
                        })()}
                      </span>
                    </div>
                    <button
                      className="delete-notification-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.deleteNotification(notification.id);
                      }}
                    >
                      <i className="fas fa-times"></i>
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
            <span className="logout-text">Logout</span>
            <span className="logout-icon"><i className="fas fa-sign-out-alt"></i></span>
          </button>
        </div>
      </header>
    );
  }
}

export default Header;
