import React, { Component } from 'react';
import { jobService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class JobDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: null,
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchJobDetails();
  }

  fetchJobDetails = async () => {
    try {
      const path = history.location.pathname || '';
      const match = path.match(/jobs\/(\d+)/);
      const jobId = match ? match[1] : null;
      const response = await jobService.getJob(jobId);
      this.setState({
        job: response.data,
        isLoading: false
      });
    } catch (error) {
      this.setState({
        error: 'Error fetching job details. Please try again later.',
        isLoading: false
      });
    }
  }

  handleApply = () => {
    const path = history.location.pathname || '';
    const match = path.match(/jobs\/(\d+)/);
    const jobId = match ? match[1] : null;
    if (jobId) {
      history.push(`/student/jobs/${jobId}/apply`);
    }
  }

  render() {
    const { job, isLoading, error } = this.state;
    const { user } = this.props;

    if (isLoading) {
      return <div className="loading-spinner"></div>;
    }

    if (!job) {
      return <div className="error-message">Job not found</div>;
    }

    const isDeadlinePassed = new Date(job.apply_by) < new Date();

    return (
      <div className="job-details">
        {error && <div className="error-message">{error}</div>}

        <div className="job-header">
          <div className="header-content">
            <h1>{job.title}</h1>
            <p className="company">{job.company}</p>
            <div className="job-meta">
              <span className="location">📍 {job.location}</span>
              <span className="stipend">💰 {job.stipend}</span>
              <span className="deadline">
                Apply by: {new Date(job.apply_by).toLocaleDateString()}
              </span>
            </div>
          </div>

          {user?.role === 'student' && (
            <button
              className={`apply-button ${isDeadlinePassed ? 'disabled' : ''}`}
              onClick={this.handleApply}
              disabled={isDeadlinePassed}
            >
              {isDeadlinePassed ? 'Deadline Passed' : 'Apply Now'}
            </button>
          )}
        </div>

        <div className="content-sections">
          <div className="main-content">
            <section className="job-description">
              <h2>Job Description</h2>
              <div className="description-content">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          </div>

          <div className="side-content">
            <div className="alumni-info">
              <h3>Posted by</h3>
              <div className="alumni-profile">
                <div className="profile-circle">
                  {(job.alumni_name || 'U').charAt(0)}
                </div>
                <div className="alumni-details">
                  <p className="alumni-name">{job.alumni_name}</p>
                  <p className="posted-date">
                    Posted on: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {isDeadlinePassed && (
              <div className="deadline-notice">
                <span className="warning-icon">⚠️</span>
                <p>Application deadline has passed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default JobDetails;
