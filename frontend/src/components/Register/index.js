import React, { Component } from 'react';
import { authService } from '../../services/api';
import history from '../../utils/history';
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
      success: null
    };
  }

  componentDidMount() {
    // Clear any existing form data when component mounts
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
      success: null
    });
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: null });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });
    try {
      const { name, email, password, role } = this.state;
      await authService.register({ name, email, password, role });

      // Show success message and redirect to login
      this.setState({ 
        error: null,
        success: 'Registration successful! Please log in with your credentials.',
        isLoading: false 
      });
      
      // Clear form after successful registration
      setTimeout(() => {
        this.clearForm();
        history.push('/login');
      }, 2000);
    } catch (err) {
      this.setState({ error: 'Registration failed. Try a different email.', isLoading: false });
    }
  }

  render() {
    const { name, email, password, role, isLoading, error, success } = this.state;
    return (
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">Create your account</h1>
          <form onSubmit={this.handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" value={name} onChange={this.handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email / Student ID</label>
              <input id="email" name="email" type="text" value={email} onChange={this.handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={password} onChange={this.handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={role} onChange={this.handleInputChange} className="form-select">
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className={`register-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
            <div className="auth-switch">
              <span>Already have an account? </span>
              <a href="/login" className="login-link" onClick={this.clearForm}>Log in</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;



