import React, { useState, useEffect } from 'react';
import { getUserProfile, getUserProgress } from '../services/api';
import MathDisplay from '../components/MathDisplay';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        const progressData = await getUserProgress();
        
        setProfile(profileData);
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      
      {profile && (
        <div className="profile-card">
          <h3>{profile.username}</h3>
          <p>Email: {profile.email}</p>
          <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      )}
      
      {progress && (
        <div className="progress-section">
          <h3>Your Progress</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Problems Attempted</h4>
              <div className="stat-value">{progress.total_problems_attempted}</div>
            </div>
            
            <div className="stat-card">
              <h4>Problems Solved</h4>
              <div className="stat-value">{progress.total_problems_solved}</div>
            </div>
            
            <div className="stat-card">
              <h4>Success Rate</h4>
              <div className="stat-value">
                {progress.total_problems_attempted > 0 
                  ? Math.round((progress.total_problems_solved / progress.total_problems_attempted) * 100) 
                  : 0}%
              </div>
            </div>
            
            <div className="stat-card">
              <h4>Total Attempts</h4>
              <div className="stat-value">{progress.total_attempts}</div>
            </div>
          </div>
          
          {progress.solved_problems.length > 0 && (
            <div className="solved-problems">
              <h4>Solved Problems</h4>
              <ul>
                {progress.solved_problems.map(problem => (
                  <li key={problem.problem_id}>
                    <a href={`/problems/${problem.problem_id}`}>{problem.title}</a>
                    <span className="difficulty">Difficulty: {problem.difficulty}/5</span>
                    <span className="solved-date">
                      Solved on {new Date(problem.solved_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {progress.unsolved_problems.length > 0 && (
            <div className="unsolved-problems">
              <h4>Problems to Revisit</h4>
              <ul>
                {progress.unsolved_problems.map(problem => (
                  <li key={problem.problem_id}>
                    <a href={`/problems/${problem.problem_id}`}>{problem.title}</a>
                    <span className="difficulty">Difficulty: {problem.difficulty}/5</span>
                    <span className="attempt-date">
                      Last attempt: {new Date(problem.last_attempt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;