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
      error: null
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: null });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });
    try {
      const { name, email, password, role } = this.state;
      const response = await authService.register({ name, email, password, role });

      this.props.onLogin(response.user);
      history.push(role === 'student' ? '/student/dashboard' : '/alumni/dashboard');
    } catch (err) {
      this.setState({ error: 'Registration failed. Try a different email.', isLoading: false });
    }
  }

  render() {
    const { name, email, password, role, isLoading, error } = this.state;
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
            <button type="submit" className={`register-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
            <div className="auth-switch">
              <span>Already have an account? </span>
              <a href="/login" className="login-link">Log in</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;



