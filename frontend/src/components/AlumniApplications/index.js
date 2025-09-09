import React, { Component } from 'react';
import { jobService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class AlumniApplications extends Component {
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

    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    return (
      <div className="alumni-applications">
        <div className="applications-header">
          <h1>All Applications</h1>
          <p>View applications for all your job postings</p>
        </div>

        {error && <div className="error-message">{error}</div>}

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
                  <p className="applications-count">Applications: <strong>{job.applications_count}</strong></p>
                </div>
                <div className="job-card-footer">
                  <button
                    className="view-applications-button"
                    onClick={() => history.push(`/alumni/jobs/${job.id}/applications`)}
                  >
                    View Applications ({job.applications_count})
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

export default AlumniApplications;
