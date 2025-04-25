import React, { useState } from 'react';
import axios from 'axios';

const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [error, setError] = useState('');

  const handleButtonClick = async (value) => {
    if (value === 'C') {
      setDisplay('');
      setError('');
    } else if (value === '=') {
      try {
        const [num1, operation, num2] = parseExpression(display);
        const response = await axios.post(
          `http://localhost:5000/api/calculate/${operation}`,
          { num1: parseFloat(num1), num2: parseFloat(num2) }
        );
        setDisplay(response.data.result.toString());
      } catch (err) {
        console.error('Calculation error:', err);
        setError(err.response?.data?.error || 'An error occurred');
      }
    } else {
      setDisplay((prev) => prev + value);
    }
  };

  const parseExpression = (expression) => {
    const match = expression.match(/(\d+)([+\-*/])(\d+)/);
    if (!match) throw new Error('Invalid expression');
    const [, num1, operator, num2] = match;
    const operationMap = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      '/': 'divide',
    };
    return [num1, operationMap[operator], num2];
  };

  return (
    <div className="calculator">
      <h2>Math Calculator</h2>
      <div className="display">{display || '0'}</div>
      <div className="buttons">
        {['7', '8', '9', '/'].map((btn) => (
          <button key={btn} onClick={() => handleButtonClick(btn)}>
            {btn}
          </button>
        ))}
        {['4', '5', '6', '*'].map((btn) => (
          <button key={btn} onClick={() => handleButtonClick(btn)}>
            {btn}
          </button>
        ))}
        {['1', '2', '3', '-'].map((btn) => (
          <button key={btn} onClick={() => handleButtonClick(btn)}>
            {btn}
          </button>
        ))}
        {['C', '0', '=', '+'].map((btn) => (
          <button key={btn} onClick={() => handleButtonClick(btn)}>
            {btn}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Calculator;