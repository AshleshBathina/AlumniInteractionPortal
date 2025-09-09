import React, { Component } from 'react';
import { authService } from '../../services/api';
import history from '../../utils/history';
import './index.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    // Clear any existing form data when component mounts
    this.clearForm();
  }

  clearForm = () => {
    this.setState({
      email: '',
      password: '',
      isLoading: false,
      error: null
    });
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

      // Call the onLogin prop with user data
      this.props.onLogin(response.user);

      // Clear form after successful login
      this.clearForm();

      // Navigate to dashboard based on role returned by backend
      const userRole = response.user?.role;
      history.push(userRole === 'student' ? '/student/dashboard' : '/alumni/dashboard');
    } catch (error) {
      this.setState({
        error: 'Invalid email or password'
      });
      // Clear password field on error for security
      this.setState({ password: '' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { email, password, isLoading, error } = this.state;

    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Alumni Interaction Portal</h1>
          <form onSubmit={this.handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email / Student ID</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                className="form-input"
                placeholder="Enter your email or student ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <div className="auth-switch">
              <span>New here? </span>
              <a href="/register" className="register-link" onClick={this.clearForm}>Create an account</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
