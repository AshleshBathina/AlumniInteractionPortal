import React, { Component } from 'react';
import { jobService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class AlumniDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs();
      const jobs = response.data
        .filter(job => job.alumni_id === this.props.user.id)
        .map(job => ({
          ...job,
          applications_count: job.applications_count || 0
        }));
      this.setState({ jobs, isLoading: false });
    } catch (error) {
      this.setState({
        error: 'Error fetching jobs. Please try again later.',
        isLoading: false
      });
    }
  }

  render() {
    const { jobs, isLoading, error } = this.state;
    const { user } = this.props;

    if (isLoading) {
      return <div className="loading-spinner"></div>;
    }

    return (
      <div className="alumni-dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
          <button
            className="post-job-button"
            onClick={() => history.push('/alumni/post-job')}
          >
            Post New Job
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Active Jobs</h3>
            <p className="stat-number">{jobs.length}</p>
          </div>
          {/* Add more stat cards as needed */}
        </div>

        <h2 className="section-title">Your Job Postings</h2>
        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p className="no-jobs">You haven't posted any jobs yet.</p>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className="company">{job.company}</span>
                </div>
                <div className="job-card-body">
                  <p className="location">📍{job.location}</p>
                  <p className="stipend">💰 {job.stipend}</p>

                </div>
                <div className="job-card-footer">
                  <button
                    className="view-applications-button"
                    onClick={() => history.push(`/alumni/jobs/${job.id}/applications`)}
                  >
                    View Applications
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default AlumniDashboard;
