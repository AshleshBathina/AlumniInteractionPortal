import React, { Component } from 'react';
import { authService } from '../../services/api';
import history from '../../utils/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faUserGraduate, 
  faChalkboardUser,
  faSpinner,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import './index.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      role: 'student',
      isLoading: false,
      error: null,
      success: null,
      activeField: null
    };
  }

  componentDidMount() {
    this.clearForm();
  }

  clearForm = () => {
    this.setState({
      name: '',
      email: '',
      password: '',
      role: 'student',
      isLoading: false,
      error: null,
      success: null,
      activeField: null
    });
  }

  handleInputFocus = (fieldName) => {
    this.setState({ activeField: fieldName });
  }

  handleInputBlur = () => {
    this.setState({ activeField: null });
  }

  handleInputChange = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value, 
      error: null,
      success: null 
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null, success: null });
    try {
      const { name, email, password, role } = this.state;
      await authService.register({ name, email, password, role });

      this.setState({ 
        error: null,
        success: 'Registration successful! Redirecting to login...',
        isLoading: false 
      });

      setTimeout(() => {
        this.clearForm();
        history.push('/login');
      }, 2000);
    } catch (err) {
      this.setState({ 
        error: err.response?.data?.message || 'Registration failed. Try a different email.', 
        isLoading: false 
      });
    }
  }

  render() {
    const { name, email, password, role, isLoading, error, success, activeField } = this.state;

    return (
      <div className="register-container">
        <div className="bg-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
          <div className="wave wave-4"></div>
        </div>

        <div className="register-card">
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-icon main">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <h1 className="app-name">AlumniHub</h1>
              <p className="app-tagline">Connecting past, present and future</p>
              <div className="logo-subtext">
                <p>Create an account to access exclusive alumni resources, networking opportunities, and career services.</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="register-title">Create Your Account</h2>
            <p className="register-subtitle">Join our alumni community today</p>
            
            <form onSubmit={this.handleSubmit} className="register-form">
              <div className={`form-group ${activeField === 'name' ? 'focused' : ''}`}>
                <label htmlFor="name">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  Full Name
                </label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  value={name} 
                  onChange={this.handleInputChange}
                  onFocus={() => this.handleInputFocus('name')}
                  onBlur={this.handleInputBlur}
                  className="form-input" 
                  placeholder="Enter your full name"
                  required 
                />
              </div>

              <div className={`form-group ${activeField === 'email' ? 'focused' : ''}`}>
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  Email / Student ID
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="text" 
                  value={email} 
                  onChange={this.handleInputChange}
                  onFocus={() => this.handleInputFocus('email')}
                  onBlur={this.handleInputBlur}
                  className="form-input" 
                  placeholder="Enter your email or student ID"
                  required 
                />
              </div>

              <div className={`form-group ${activeField === 'password' ? 'focused' : ''}`}>
                <label htmlFor="password">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={password} 
                  onChange={this.handleInputChange}
                  onFocus={() => this.handleInputFocus('password')}
                  onBlur={this.handleInputBlur}
                  className="form-input" 
                  placeholder="Create a secure password"
                  required 
                />
              </div>

              <div className={`form-group ${activeField === 'role' ? 'focused' : ''}`}>
                <label htmlFor="role">
                  <FontAwesomeIcon icon={faChalkboardUser} className="input-icon" />
                  Role
                </label>
                <select 
                  id="role" 
                  name="role" 
                  value={role} 
                  onChange={this.handleInputChange}
                  onFocus={() => this.handleInputFocus('role')}
                  onBlur={this.handleInputBlur}
                  className="form-select"
                >
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>

              {error && (
                <div className="error-message">
                  <FontAwesomeIcon icon={faChalkboardUser} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className={`register-button ${isLoading ? 'loading' : ''}`} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="button-spinner" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Register Now
                  </>
                )}
              </button>
              
              <div className="auth-switch">
                <span>Already have an account? </span>
                <a href="/login" className="login-link" onClick={this.clearForm}>Log in</a>
              </div>
            </form>

            {success && (
              <div className="success-message-bottom">
                <FontAwesomeIcon icon={faUserGraduate} />
                <span>{success}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
