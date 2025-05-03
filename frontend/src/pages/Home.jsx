import React, { useState, useEffect } from 'react';
import { getHello } from '../services/api';
import MathDisplay from '../components/MathDisplay';

// List of equations
const equations = [
  { formula: 'e^{i\\pi} + 1 = 0', description: "Euler's identity - connecting five fundamental constants in mathematics." },
  { formula: 'a^2 + b^2 = c^2', description: "Pythagorean theorem - a fundamental relation in Euclidean geometry." },
  { formula: '\\int_a^b f(x) dx', description: "Definite integral - the area under a curve between two points." },
  { formula: '\\frac{d}{dx}e^x = e^x', description: "Derivative of the exponential function." },
  { formula: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}', description: "Basel problem - solved by Euler." }
];

const Home = () => {
  const [message, setMessage] = useState('');
  const [featuredEquation, setFeaturedEquation] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHello();
        setMessage(data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const randomIndex = Math.floor(Math.random() * equations.length);
    setFeaturedEquation(equations[randomIndex]);
    
    fetchData();
  }, []);
  
  return (
    <div className="home">
      <h2>Welcome to Mathblivion</h2>
      <p>Discover the beauty of mathematics with interactive learning.</p>
      <p>Backend says: {message}</p>
      
      <section>
        <h3>Featured Equation</h3>
        {featuredEquation ? (
          <>
            <MathDisplay
              inline={false}
              formula={featuredEquation.formula}
            />
            <p>{featuredEquation.description}</p>
          </>
        ) : (
            <p>Loading equation...</p>
        )}
      </section>
    </div>
  );
};

export default Home;