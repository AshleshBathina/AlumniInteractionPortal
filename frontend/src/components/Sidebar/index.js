import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

class Sidebar extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (window.innerWidth > 1024) {
      this.props.onClose();
    }
  }

  render() {
    const { userRole, isOpen, onClose } = this.props;
    const baseRoute = userRole === 'alumni' ? '/alumni' : '/student';

    return (
      <>
        {isOpen && <div className="sidebar-overlay active" onClick={onClose} />}
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {userRole === 'alumni' ? (
              <>
                <NavLink
                  to={`${baseRoute}/dashboard`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className="fas fa-chart-line nav-icon"></i>
                  <span className="nav-text">Dashboard</span>
                </NavLink>

                <NavLink
                  to={`${baseRoute}/post-job`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className="fas fa-edit nav-icon"></i>
                  <span className="nav-text">Post Job</span>
                </NavLink>

                <NavLink
                  to={`${baseRoute}/applications`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className="fas fa-folder-open nav-icon"></i>
                  <span className="nav-text">Applications</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={`${baseRoute}/dashboard`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className="fas fa-search nav-icon"></i>
                  <span className="nav-text">Browse Jobs</span>
                </NavLink>

                <NavLink
                  to={`${baseRoute}/applications`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className="fas fa-file-alt nav-icon"></i>
                  <span className="nav-text">My Applications</span>
                </NavLink>
              </>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="fas fa-user nav-icon"></i>
              <span className="nav-text">Profile</span>
            </NavLink>
          </nav>
        </aside>
      </>
    );
  }
}

export default Sidebar;
