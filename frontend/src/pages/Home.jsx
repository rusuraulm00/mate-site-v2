import React, { useState, useEffect } from 'react';
import { getHello } from '../services/api';
import MathDisplay from '../components/MathDisplay';

const Home = () => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHello();
        setMessage(data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="home">
      <h2>Welcome to Mathblivion</h2>
      <p>Discover the beauty of mathematics with interactive learning.</p>
      <p>Backend says: {message}</p>
      
      <section>
        <h3>Featured Equation</h3>
        <MathDisplay 
          inline={false} 
          formula={'e^{i\\pi} + 1 = 0'} 
        />
        <p>Euler's identity - connecting five fundamental constants in mathematics.</p>
      </section>
    </div>
  );
};

export default Home;