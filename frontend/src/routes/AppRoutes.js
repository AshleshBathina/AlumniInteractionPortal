import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import AlumniDashboard from '../components/AlumniDashboard';
import StudentDashboard from '../components/StudentDashboard';
import PostJob from '../components/PostJob';
import EditJob from '../components/EditJob';
import AlumniApplications from '../components/AlumniApplications';
import JobDetails from '../components/JobDetails';
import Applications from '../components/Applications';
import ApplyJob from '../components/ApplyJob';
import Profile from '../components/Profile';

class AppRoutes extends React.Component {
  render() {
    const { isAuthenticated, user, onLogin } = this.props;

    if (!isAuthenticated) {
      return <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register onLogin={onLogin} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Login onLogin={onLogin} />} />
      </Routes>;
    }

    // Guard against momentary undefined user when authenticated
    if (isAuthenticated && !user) {
      return <Routes>
        <Route path="*" element={<div style={{ padding: '2rem' }}>Loading...</div>} />
      </Routes>;
    }

    const role = user?.role;

    return (
      <Routes>
        {role === 'alumni' ? (
          <>
            <Route path="/alumni/dashboard" element={<AlumniDashboard user={user} />} />
            <Route path="/alumni/post-job" element={<PostJob />} />
            <Route path="/alumni/applications" element={<AlumniApplications user={user} />} />
            <Route path="/alumni/jobs/:jobId/edit" element={<EditJob />} />
            <Route path="/alumni/jobs/:jobId/applications" element={<Applications />} />
            <Route path="/" element={<Navigate to="/alumni/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/jobs/:jobId" element={<JobDetails />} />
            <Route path="/student/jobs/:jobId/apply" element={<ApplyJob />} />
            <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
          </>
        )}
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
}

export default AppRoutes;
