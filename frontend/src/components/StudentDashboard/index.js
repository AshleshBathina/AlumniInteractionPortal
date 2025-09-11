import React, { Component } from 'react';
import { jobService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      filteredJobs: [],
      isLoading: true,
      error: null,
      searchTerm: '',
      filters: {
        location: '',
        stipendRange: 'all'
      }
    };
  }

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs();
      this.setState({ 
        jobs: response.data,
        filteredJobs: response.data,
        isLoading: false 
      });
    } catch (error) {
      this.setState({ 
        error: 'Error fetching jobs. Please try again later.',
        isLoading: false 
      });
    }
  }

  handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    this.setState({ searchTerm }, this.filterJobs);
  }

  handleFilterChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [name]: value
      }
    }), this.filterJobs);
  }

  filterJobs = () => {
    const { jobs, searchTerm, filters } = this.state;

    let filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm);

      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());

      let matchesStipend = true;
      if (filters.stipendRange !== 'all') {
        const stipendValue = parseInt(job.stipend.replace(/[^0-9]/g, ''));
        switch (filters.stipendRange) {
          case 'under5k':
            matchesStipend = stipendValue < 5000;
            break;
          case '5kTo15k':
            matchesStipend = stipendValue >= 5000 && stipendValue <= 15000;
            break;
          case 'above15k':
            matchesStipend = stipendValue > 15000;
            break;
          default:
            matchesStipend = true;
        }
      }

      return matchesSearch && matchesLocation && matchesStipend;
    });

    this.setState({ filteredJobs: filtered });
  }

  render() {
    const { 
      filteredJobs, 
      isLoading, 
      error, 
      searchTerm, 
      filters 
    } = this.state;

    if (isLoading) {
      return <div className="loading-spinner"></div>;
    }

    return (
      <div className="student-dashboard">
        <h2 style={{ marginTop: 0, marginBottom: '12px', color: '#0D3C61' }}>Student Dashboard</h2>
        <div className="dashboard-header">
          <h1>Browse Opportunities</h1>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={this.handleSearch}
              className="search-input"
            />
            <select
              name="location"
              value={filters.location}
              onChange={this.handleFilterChange}
              className="filter-select"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select
              name="stipendRange"
              value={filters.stipendRange}
              onChange={this.handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Stipends</option>
              <option value="under5k">Under ₹5,000</option>
              <option value="5kTo15k">₹5,000 - ₹15,000</option>
              <option value="above15k">Above ₹15,000</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <p className="no-jobs">No jobs found matching your criteria.</p>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className="company">{job.company}</span>
                </div>
                <div className="job-card-body">
                  <p className="location"><i className="fas fa-map-marker-alt"></i>{job.location}</p>
                  <p className="stipend"><i className="fas fa-wallet"></i>{job.stipend}</p>
                  <p className="posted-by"><i className="fas fa-user"></i>Posted by: {job.alumni_name}</p>
                  <p className="apply-by"><i className="fas fa-calendar-alt"></i>Apply by: {new Date(job.apply_by).toLocaleDateString()}</p>
                </div>
                <div className="job-card-footer">
                  <button 
                    className="view-details-button"
                    onClick={() => history.push(`/student/jobs/${job.id}`)}
                  >
                    <i className="fas fa-eye"></i>View Details
                  </button>
                  <button 
                    className="apply-button"
                    onClick={() => history.push(`/student/jobs/${job.id}/apply`)}
                  >
                    <i className="fas fa-paper-plane"></i>Apply Now
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

export default StudentDashboard;
