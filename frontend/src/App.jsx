import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Topics from './pages/Topics';
import Calculator from './pages/Calculator';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import { getUserProfile, logoutUser } from './services/api';
import './App.css';
import Lessons from './pages/Lessons';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected route component
  const ProtectedRoute = ({ element }) => {
    if (loading) return <div className="loading">Loading...</div>;
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-container">
          <h1 className="logo">Mathblivion</h1>
          <nav className="navbar">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/topics">Topics</Link></li>
              <li><Link to="/problems">Problems</Link></li>
              <li><Link to="/calculator">Calculator</Link></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              )}
            </ul>
          </nav>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/topics/:topicId/lessons" element={<Lessons />} /> 
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problems/topic/:topicId" element={<ProblemList />} />
            <Route path="/problems/:problemId" element={<ProblemDetail isAuthenticated={isAuthenticated} />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          </Routes>
        </main>
        
        <footer>
          <p>Mathblivion &copy; {new Date().getFullYear()}</p>
          <a
            href="https://github.com/rusuraulm00"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.096.81 2.21 0 1.595-.015 2.88-.015 3.27 0 .315.21.69.825.57 4.77-1.585 8.205-6.082 8.205-11.385 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;