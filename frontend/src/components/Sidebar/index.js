import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';

class Sidebar extends Component {
  render() {
    const { userRole } = this.props;
    const baseRoute = userRole === 'alumni' ? '/alumni' : '/student';

    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {userRole === 'alumni' ? (
            <>
              <NavLink 
                to={`${baseRoute}/dashboard`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </NavLink>

              <NavLink 
                to={`${baseRoute}/post-job`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Post Job</span>
              </NavLink>

              <NavLink 
                to={`${baseRoute}/jobs`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">📁</span>
                <span className="nav-text">Applications</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                to={`${baseRoute}/dashboard`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">🔍</span>
                <span className="nav-text">Browse Jobs</span>
              </NavLink>

              <NavLink 
                to={`${baseRoute}/applications`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">📄</span>
                <span className="nav-text">My Applications</span>
              </NavLink>
            </>
          )}

          <NavLink 
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </NavLink>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
