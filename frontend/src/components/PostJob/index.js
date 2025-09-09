import React, { Component } from 'react';
import { jobService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class PostJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        title: '',
        company: '',
        location: '',
        description: '',
        stipend: '',
        apply_by: ''
      },
      isSubmitting: false,
      error: null,
      success: false
    };
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

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, error: null });

    try {
      await jobService.createJob(this.state.formData);
      this.setState({ 
        success: true,
        isSubmitting: false
      });

      // Redirect after successful submission
      setTimeout(() => {
        history.push('/alumni/dashboard');
      }, 2000);
    } catch (error) {
      this.setState({
        error: 'Error posting job. Please try again.',
        isSubmitting: false
      });
    }
  }

  render() {
    const { formData, isSubmitting, error, success } = this.state;

    return (
      <div className="post-job">
        <h1>Post a New Job</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Job posted successfully!</div>}

        <form onSubmit={this.handleSubmit} className="job-form">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={this.handleInputChange}
              required
              placeholder="e.g., Software Engineer Intern"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company Name *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={this.handleInputChange}
              required
              placeholder="e.g., Tech Solutions Inc."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={this.handleInputChange}
              required
              placeholder="e.g., Remote, Bangalore, Hybrid"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stipend">Stipend *</label>
            <input
              type="text"
              id="stipend"
              name="stipend"
              value={formData.stipend}
              onChange={this.handleInputChange}
              required
              placeholder="e.g., ₹15,000/month"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply_by">Apply By *</label>
            <input
              type="date"
              id="apply_by"
              name="apply_by"
              value={formData.apply_by}
              onChange={this.handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={this.handleInputChange}
              required
              placeholder="Describe the job role, requirements, and responsibilities..."
              className="form-textarea"
              rows="6"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    );
  }
}

export default PostJob;
