import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, submitSolution } from '../services/api';
import MathDisplay from '../components/MathDisplay';

const ProblemDetail = ({ isAuthenticated }) => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    if (selectedChoice === null) {
      setFeedback({ is_correct: false, message: 'Please select an answer.' });
      return;
    }

    const isCorrect = selectedChoice === problem.correct_choice_id;
    setFeedback({
      is_correct: isCorrect,
      message: isCorrect
        ? 'Correct! Well done!'
        : `Incorrect. The correct answer is: ${
            problem.choices.find((choice) => choice.id === problem.correct_choice_id).text
          }`,
    });
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
      
      {/* <div className="problem-content">
        <MathDisplay inline={false} formula={problem.content} />
      </div> */}
      
      <form onSubmit={handleSubmit} className="solution-form">
        <h3>Choose the correct answer: </h3>
        <div className="choices">
          {problem.choices.map((choice) => (
            <label key={choice.id} className="choice">
              <input
                type="radio"
                name="choice"
                value={choice.id}
                checked={selectedChoice === choice.id}
                onChange={() => setSelectedChoice(choice.id)}
              />
              {choice.text}
            </label>
          ))}
        </div>

        <button type="submit">Submit Answer</button>
      </form>
      
      {feedback && (
        <div className={`feedback ${feedback.is_correct ? 'correct' : 'incorrect'}`}>
          <h3>{feedback.is_correct ? 'Correct!' : 'Not quite right'}</h3>
          
          {feedback && (
        <div className={`feedback ${feedback.is_correct ? 'correct' : 'incorrect'}`}>
          <p>{feedback.message}</p>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;