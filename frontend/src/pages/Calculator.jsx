import React, { useState } from 'react';
import axios from 'axios';
import './Calculator.css';

const Calculator = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/calculate/${operation}`, 
        { num1: parseFloat(num1), num2: parseFloat(num2) }
      );
      setResult(response.data.result);
    } catch (error) {
      console.error('Calculation error:', error);
      setError(error.response?.data?.error || 'An error occurred');
    }
  };
  
  return (
    <div className="calculator">
      <h2>Mathematical Calculator</h2>
      
      <form onSubmit={handleCalculate}>
        <div>
          <label>
            First Number:
            <input 
              type="number" 
              value={num1} 
              onChange={(e) => setNum1(e.target.value)}
              required
            />
          </label>
        </div>
        
        <div>
          <label>
            Operation:
            <select 
              value={operation} 
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (-)</option>
              <option value="multiply">Multiplication (×)</option>
              <option value="divide">Division (÷)</option>
            </select>
          </label>
        </div>
        
        <div>
          <label>
            Second Number:
            <input 
              type="number" 
              value={num2} 
              onChange={(e) => setNum2(e.target.value)}
              required
            />
          </label>
        </div>
        
        <button type="submit">Calculate</button>
      </form>
      
      {error && <p className="error">{error}</p>}
      
      {result !== null && (
        <div className="result">
          <h3>Result: {result}</h3>
        </div>
      )}
    </div>
  );
};

export default Calculator;