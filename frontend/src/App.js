import React from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import history from './utils/history';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null
    };
  }

  componentDidMount() {
    let parsedUser = null;
    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    if (parsedUser && token) {
      this.setState({ isAuthenticated: true, user: parsedUser });
    } else {
      if (history.location.pathname !== '/login' && history.location.pathname !== '/register') {
        history.replace('/login');
      }
    }
  }

  handleLogin = (user) => {
    this.setState({ isAuthenticated: true, user });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ isAuthenticated: false, user: null });
  };

  render() {
    const { isAuthenticated, user } = this.state;

    return (
      <HistoryRouter history={history}>
        <div className="app">
          {isAuthenticated && (
            <>
              <Header user={user} onLogout={this.handleLogout} />
              <div className="main-container">
                {user?.role === 'alumni' && (
                  <Sidebar userRole={user?.role} />
                )}
                <main className="content">
                  <AppRoutes 
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogin={this.handleLogin}
                  />
                </main>
              </div>
            </>
          )}
          {!isAuthenticated && (
            history.location.pathname === '/register' ? (
              <Register onLogin={this.handleLogin} />
            ) : (
              <Login onLogin={this.handleLogin} />
            )
          )}
        </div>
      </HistoryRouter>
    );
  }
}

export default App;
