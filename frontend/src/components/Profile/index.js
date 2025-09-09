import React, { Component } from 'react';
import { userService } from '../../services/api';
import './index.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        email: ''
      },
      isLoading: true,
      isSubmitting: false,
      error: null,
      success: false
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      this.setState({
        formData: {
          name: response.data.name,
          email: response.data.email
        },
        isLoading: false
      });
    } catch (error) {
      this.setState({
        error: 'Error fetching profile. Please try again later.',
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

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, error: null });

    try {
      await userService.updateProfile(this.state.formData);
      this.setState({
        success: true,
        isSubmitting: false
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        this.setState({ success: false });
      }, 3000);
    } catch (error) {
      this.setState({
        error: 'Error updating profile. Please try again.',
        isSubmitting: false
      });
    }
  }

  render() {
    const { formData, isLoading, isSubmitting, error, success } = this.state;
    const { user } = this.props;

    if (isLoading) {
      return <div className="loading-spinner"></div>;
    }

    return (
      <div className="profile">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-circle large">
              {formData.name.charAt(0)}
            </div>
            <div className="profile-title">
              <h1>Profile Settings</h1>
              <p className="role-tag">{user.role}</p>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Profile updated successfully!</div>}

        <div className="profile-content">
          <form onSubmit={this.handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={this.handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={this.handleInputChange}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`save-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <div className="profile-sections">
            <section className="profile-section">
              <h2>Profile Picture</h2>
              <p className="section-description">
                Currently using name initials as profile picture. 
                Profile picture upload functionality will be available soon.
              </p>
            </section>

            <section className="profile-section">
              <h2>Account Settings</h2>
              <div className="account-info">
                <div className="info-item">
                  <span className="label">Account Type:</span>
                  <span className="value">{user.role}</span>
                </div>
                <div className="info-item">
                  <span className="label">Member Since:</span>
                  <span className="value">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
