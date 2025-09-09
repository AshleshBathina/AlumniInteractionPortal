import React, { Component } from 'react';
import { jobService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class EditJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: null,
      isLoading: true,
      isSubmitting: false,
      error: null,
      formData: {
        title: '',
        description: '',
        company: '',
        location: '',
        stipend: '',
        apply_by: ''
      }
    };
  }

  componentDidMount() {
    this.fetchJob();
  }

  fetchJob = async () => {
    try {
      const path = history.location.pathname || '';
      const match = path.match(/jobs\/(\d+)\/edit/);
      const jobId = match ? match[1] : null;
      
      if (!jobId) {
        this.setState({ error: 'Invalid job ID', isLoading: false });
        return;
      }

      const response = await jobService.getJob(jobId);
      const job = response.data;
      
      this.setState({
        job,
        formData: {
          title: job.title || '',
          description: job.description || '',
          company: job.company || '',
          location: job.location || '',
          stipend: job.stipend || '',
          apply_by: job.apply_by ? job.apply_by.split('T')[0] : ''
        },
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
      }
    }));
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, error: null });

    try {
      const { job } = this.state;
      await jobService.updateJob(job.id, this.state.formData);
      history.push('/alumni/dashboard');
    } catch (error) {
      this.setState({
        error: 'Error updating job. Please try again.',
        isSubmitting: false
      });
    }
  }

  render() {
    const { job, isLoading, isSubmitting, error, formData } = this.state;

    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    if (error && !job) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="edit-job">
        <div className="edit-job-header">
          <h1>Edit Job</h1>
          <button
            className="back-button"
            onClick={() => history.push('/alumni/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={this.handleSubmit} className="edit-job-form">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={this.handleInputChange}
              className="form-input"
              placeholder="Enter job title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={this.handleInputChange}
              className="form-input"
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={this.handleInputChange}
              className="form-textarea"
              placeholder="Enter job description"
              rows="6"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={this.handleInputChange}
                className="form-input"
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stipend">Stipend/Salary</label>
              <input
                type="text"
                id="stipend"
                name="stipend"
                value={formData.stipend}
                onChange={this.handleInputChange}
                className="form-input"
                placeholder="e.g., ₹50,000/month"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="apply_by">Apply By *</label>
            <input
              type="date"
              id="apply_by"
              name="apply_by"
              value={formData.apply_by}
              onChange={this.handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => history.push('/alumni/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default EditJob;
