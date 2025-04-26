import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, submitSolution } from '../services/api';
import MathDisplay from '../components/MathDisplay';

const ProblemDetail = ({ isAuthenticated }) => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [userSolution, setUserSolution] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const data = await getProblem(problemId);
        setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Failed to load problem. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/problems/${problemId}` } });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    
    try {
      const result = await submitSolution(problemId, userSolution);
      setFeedback(result);
    } catch (error) {
      console.error('Error submitting solution:', error);
      setFeedback({
        is_correct: false,
        error: 'Failed to submit solution. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading problem...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!problem) {
    return <div className="not-found">Problem not found</div>;
  }

  return (
    <div className="problem-detail">
      <h2>{problem.title}</h2>
      
      <div className="problem-difficulty">
        Difficulty: {Array(problem.difficulty).fill('★').join('')}
        {Array(5 - problem.difficulty).fill('☆').join('')}
      </div>
      
      <div className="problem-content">
        <MathDisplay inline={false} formula={problem.content} />
      </div>
      
      <form onSubmit={handleSubmit} className="solution-form">
        <h3>Your Solution</h3>
        <p className="hint">
          Enter your solution using LaTeX notation for mathematical expressions.
        </p>
        
        <textarea
          value={userSolution}
          onChange={(e) => setUserSolution(e.target.value)}
          rows={8}
          placeholder="Enter your solution here..."
          required
        />
        
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </form>
      
      {feedback && (
        <div className={`feedback ${feedback.is_correct ? 'correct' : 'incorrect'}`}>
          <h3>{feedback.is_correct ? 'Correct!' : 'Not quite right'}</h3>
          
          {feedback.is_correct ? (
            <p>Great job! Your solution is correct.</p>
          ) : (
            <div className="solution-hint">
              <p>Keep trying! Here's the correct solution:</p>
              <div className="correct-solution">
                <MathDisplay inline={false} formula={feedback.solution} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;