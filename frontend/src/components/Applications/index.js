import React, { Component } from 'react';
import { applicationService, BACKEND_URL } from '../../services/api';
import './index.css';
import history from '../../utils/history';

class Applications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      isLoading: true,
      error: null,
      selectedApplication: null
    };
  }

  componentDidMount() {
    const path = history.location.pathname || '';
    const match = path.match(/jobs\/(\d+)/);
    const jobId = match ? match[1] : null;
    if (jobId) {
      this.fetchApplications(jobId);
    } else {
      this.setState({ error: 'Invalid job id', isLoading: false });
    }
  }

  fetchApplications = async (jobId) => {
    try {
      const response = await applicationService.getJobApplications(jobId);
      this.setState({
        applications: response.data,
        isLoading: false
      });
    } catch (error) {
      this.setState({
        error: 'Error fetching applications. Please try again later.',
        isLoading: false
      });
    }
  }

  updateApplicationStatus = async (applicationId, status) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status);
      
      // Update local state
      this.setState(prevState => ({
        applications: prevState.applications.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      }));
    } catch (error) {
      this.setState({
        error: 'Error updating application status. Please try again.'
      });
    }
  }

  render() {
    const { applications, isLoading, error } = this.state;

    if (isLoading) {
      return <div className="loading-spinner"></div>;
    }

    return (
      <div className="applications">
        <h1>Applications</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="applications-grid">
          {applications.length === 0 ? (
            <p className="no-applications">No applications received yet.</p>
          ) : (
            applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="applicant-info">
                  <div className="profile-circle">
                    {(application.student_name || 'U').charAt(0)}
                  </div>
                  <div className="applicant-details">
                    <h3>{application.student_name}</h3>
                    <p className="applicant-email">{application.student_email}</p>
                  </div>
                </div>

                <div className="application-details">
                  <div className="resume-section">
                    <span className="label">Resume:</span>
                    <a 
                      href={`${BACKEND_URL}${application.resume_url || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-link"
                    >
                      View Resume
                    </a>
                  </div>

                  {application.cover_letter && (
                    <div className="cover-letter">
                      <span className="label">Cover Letter:</span>
                      <p>{application.cover_letter}</p>
                    </div>
                  )}

                  <div className="status-section">
                    <span className="label">Status:</span>
                    <select
                      value={application.status}
                      onChange={(e) => this.updateApplicationStatus(application.id, e.target.value)}
                      className={`status-select ${application.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>

                  <div className="application-meta">
                    <span className="applied-date">
                      Applied on: {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Applications;
