import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MathDisplay from '../components/MathDisplay';
import { Link } from 'react-router-dom'

const Topics = () => {
  const [topics, setTopics] = useState([]);
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    
    fetchTopics();
  }, []);
  
  const mathExamples = {
    'Algebra': 'ax^2 + bx + c = 0',
    'Calculus': '\\frac{d}{dx}(x^n) = nx^{n-1}',
    'Geometry': 'A = \\pi r^2',
    'Statistics': '\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i-\\mu)^2}'
  };
  
  return (
    <div className="topics">
      <h2>Mathematics Topics</h2>
      {topics.map((topic) => (
        <div key={topic.id} className="topic-card">
          <h3>{topic.name}</h3>
          <p>{topic.description}</p>
          <Link to={`/topics/${topic.id}/lessons`}>View Lessons</Link>
        </div>
      ))}
    </div>
  );
};

export default Topics;