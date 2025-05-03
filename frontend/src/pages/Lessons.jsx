import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Lessons = () => {
  const { topicId } = useParams(); // Get the topic ID from the URL
  const [lessons, setLessons] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/topics/${topicId}`);
        setLessons(response.data.lessons);
        setTopicName(response.data.name);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [topicId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lessons">
      {lessons.length > 0 ? (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <h3>{lesson.title}</h3>
              <p>{lesson.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No lessons available for this topic.</p>
      )}
    </div>
  );
};

export default Lessons;