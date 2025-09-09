import React, { Component } from 'react';
import { jobService, applicationService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class ApplyJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: null,
      formData: {
        resume: null,
        cover_letter: ''
      },
      isLoading: true,
      isSubmitting: false,
      error: null,
      success: false
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

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      },
      error: null
    }));
  }

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          resume: file
        },
        error: null
      }));
    } else {
      this.setState({
        error: 'Please upload a PDF file'
      });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, error: null });

    try {
      const { resume, cover_letter } = this.state.formData;
      const path = history.location.pathname || '';
      const match = path.match(/jobs\/(\d+)/);
      const jobId = match ? match[1] : null;

      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('cover_letter', cover_letter);

      await applicationService.applyForJob(jobId, formData);
      
      this.setState({
        success: true,
        isSubmitting: false
      });

      // Redirect after successful submission
      setTimeout(() => {
        history.push('/student/dashboard');
      }, 2000);
    } catch (error) {
      this.setState({
        error: 'Error submitting application. Please try again.',
        isSubmitting: false
      });
    }
  }

  render() {
    const { job, formData, isLoading, isSubmitting, error, success } = this.state;

    if (isLoading) {
      return <div className="loading-spinner"></div>;
    }

    if (!job) {
      return <div className="error-message">Job not found</div>;
    }

    return (
      <div className="apply-job">
        <div className="job-header">
          <h1>Apply for Position</h1>
          <div className="job-info">
            <h2>{job.title}</h2>
            <p className="company">{job.company}</p>
            <div className="job-meta">
              <span className="location">📍 {job.location}</span>
              <span className="stipend">💰 {job.stipend}</span>
              <span className="deadline">
                Apply by: {new Date(job.apply_by).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Application submitted successfully!</div>}

        <form onSubmit={this.handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="resume">Resume (PDF only) *</label>
            <div className="file-input-container">
              <input
                type="file"
                id="resume"
                accept=".pdf"
                onChange={this.handleFileChange}
                required
                className="file-input"
              />
              <div className="file-input-label">
                {formData.resume ? formData.resume.name : 'Choose PDF file'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cover_letter">Cover Letter</label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              value={formData.cover_letter}
              onChange={this.handleInputChange}
              className="form-textarea"
              placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
              rows="6"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    );
  }
}

export default ApplyJob;
