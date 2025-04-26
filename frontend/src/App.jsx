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
          <h1>Mathematics Explorer</h1>
          <nav>
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
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<Topics />} />
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
          <p>Mathematics Explorer &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;