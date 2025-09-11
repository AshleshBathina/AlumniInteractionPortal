// index.js (Fixed and Enhanced)
import React, { Component } from 'react';
import { authService } from '../../services/api';
import history from '../../utils/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faUserGraduate, 
  faChalkboardTeacher,
  faSpinner,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import './index.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      error: null,
      activeField: null,
      selectedRole: 'student'
    };
  }

  componentDidMount() {
    this.clearForm();
  }

  clearForm = () => {
    this.setState({
      email: '',
      password: '',
      isLoading: false,
      error: null,
      activeField: null,
      selectedRole: 'student'
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
      error: null
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    try {
      const { email, password } = this.state;
      const response = await authService.login(email, password);

      this.props.onLogin(response.user);
      this.clearForm();

      const userRole = response.user?.role;
      history.push(userRole === 'student' ? '/student/dashboard' : '/alumni/dashboard');
    } catch (error) {
      this.setState({
        error: error.response?.data?.message || 'Invalid email or password',
        password: ''
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { email, password, isLoading, error, activeField, selectedRole } = this.state;

    return (
      <div className="login-container">
        {/* Enhanced background with wave animation */}
        <div className="bg-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
          <div className="wave wave-4"></div>
        </div>
        
        <div className="login-card">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-icon main">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <h1 className="app-name">AlumniHub</h1>
              <p className="app-tagline">Connecting past, present and future</p>
              <div className="logo-subtext">
                <p>Sign in to access exclusive alumni resources, networking opportunities, and career services.</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h2 className="login-title">{selectedRole === 'alumni' ? 'Alumni Login' : 'Student Login'}</h2>
            <p className="login-subtitle">Sign in to your account to continue</p>

            {/* Role Toggle */}
            <div className="role-toggle" style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
              <button
                type="button"
                onClick={() => this.setState({ selectedRole: 'student' })}
                className={`toggle-button ${selectedRole === 'student' ? 'active' : ''}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: selectedRole === 'student' ? '#1F4E8C' : '#fff',
                  color: selectedRole === 'student' ? '#fff' : '#1F4E8C',
                  cursor: 'pointer'
                }}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => this.setState({ selectedRole: 'alumni' })}
                className={`toggle-button ${selectedRole === 'alumni' ? 'active' : ''}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: selectedRole === 'alumni' ? '#1F4E8C' : '#fff',
                  color: selectedRole === 'alumni' ? '#fff' : '#1F4E8C',
                  cursor: 'pointer'
                }}
              >
                Alumni
              </button>
            </div>
            
            <form onSubmit={this.handleSubmit} className="login-form">
              <div className={`form-group ${activeField === 'email' ? 'focused' : ''}`}>
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  {selectedRole === 'alumni' ? 'Email' : 'Email / Student ID'}
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  onFocus={() => this.handleInputFocus('email')}
                  onBlur={this.handleInputBlur}
                  className="form-input"
                  placeholder={selectedRole === 'alumni' ? 'Enter your email' : 'Enter your email or student ID'}
                  required
                />
              </div>

              <div className={`form-group ${activeField === 'password' ? 'focused' : ''}`}>
                <label htmlFor="password">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={this.handleInputChange}
                  onFocus={() => this.handleInputFocus('password')}
                  onBlur={this.handleInputBlur}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>

              {error && (
                <div className="error-message">
                  <FontAwesomeIcon icon={faChalkboardTeacher} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="button-spinner" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    Login to Account
                  </>
                )}
              </button>
              
              <div className="auth-switch">
                <span>New here? </span>
                <a href="/register" className="register-link" onClick={this.clearForm}>
                  Create an account
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;