import React, { Component } from 'react';
import { applicationService } from '../../services/api';
import './index.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotificationDropdownOpen: false,
      isApplicationsDropdownOpen: false,
      myApplications: [],
      isLoadingApplications: false,
      appsError: null
    };
  }

  toggleNotificationDropdown = () => {
    this.setState(prevState => ({
      isNotificationDropdownOpen: !prevState.isNotificationDropdownOpen
    }));
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

  getProfileInitial = () => {
    const { user } = this.props;
    return user?.name?.charAt(0).toUpperCase() || 'U';
  }

  render() {
    const { user, onLogout } = this.props;
    const { isNotificationDropdownOpen, isApplicationsDropdownOpen, myApplications, isLoadingApplications, appsError } = this.state;

    return (
      <header className="header">
        <div className="header-left">
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
              
            </button>
            {isNotificationDropdownOpen && (
              <div className="notification-dropdown">
                {/* Notification items will go here */}
                <div className="notification-item">
                  No new notifications
                </div>
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
