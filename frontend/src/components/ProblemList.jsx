import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblems, getTopics } from '../services/api';

const ProblemList = () => {
  const { topicId } = useParams();
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(topicId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await getTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setError('Failed to load topics. Please try again later.');
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const filters = {};
        
        if (selectedTopic !== 'all') {
          filters.topic_id = selectedTopic;
        }
        
        if (selectedDifficulty !== 'all') {
          filters.difficulty = selectedDifficulty;
        }
        
        const problemsData = await getProblems(filters);
        setProblems(problemsData);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [selectedTopic, selectedDifficulty]);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.id === parseInt(topicId));
    return topic ? topic.name : 'Unknown Topic';
  };

  return (
    <div className="problem-list">
      <h2>Math Problems</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="topic-filter">Topic:</label>
          <select
            id="topic-filter"
            value={selectedTopic}
            onChange={handleTopicChange}
          >
            <option value="all">All Topics</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="difficulty-filter">Difficulty:</label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
          >
            <option value="all">All Difficulties</option>
            {[1, 2, 3, 4, 5].map(level => (
              <option key={level} value={level}>{level} {level === 1 ? '(Easiest)' : level === 5 ? '(Hardest)' : ''}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading problems...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : problems.length === 0 ? (
        <div className="no-problems">No problems found for the selected filters.</div>
      ) : (
        <div className="problems-grid">
          {problems.map(problem => (
            <div key={problem.id} className="problem-card">
              <h3>
                <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
              </h3>
              
              <div className="problem-meta">
                <span className="problem-topic">
                  {problem.topic_id && getTopicName(problem.topic_id)}
                </span>
                
                <span className="problem-difficulty">
                  Difficulty: {Array(problem.difficulty).fill('★').join('')}
                  {Array(5 - problem.difficulty).fill('☆').join('')}
                </span>
              </div>
              
              <Link to={`/problems/${problem.id}`} className="problem-link">
                View Problem
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;