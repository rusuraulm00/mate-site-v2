import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Set up interceptors if needed
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Authentication services
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    // Store token in localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Topic services
export const getTopics = async () => {
  try {
    const response = await api.get('/topics');
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export const createTopic = async (topicData) => {
  try {
    const response = await api.post('/topics', topicData);
    return response.data;
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
};

// Problem services
export const getProblems = async (filters = {}) => {
  try {
    const response = await api.get('/problems', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

export const getProblem = async (problemId) => {
  try {
    const response = await api.get(`/problems/${problemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error;
  }
};

export const submitSolution = async (problemId, choiceId) => {
  try {
    const response = await api.post(`/problems/${problemId}/solution`, {
      user_solution: choiceId
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting solution:', error);
    throw error;
  }
};

export const getUserProgress = async () => {
  try {
    const response = await api.get('/problems/user-progress');
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// Calculator service 
export const calculate = async (operation, num1, num2) => {
  try {
    const response = await api.post(`/calculate/${operation}`, { num1, num2 });
    return response.data;
  } catch (error) {
    console.error('Error calculating:', error);
    throw error;
  }
};

export const getHello = async () => {
  try {
    const response = await axios.get(`${API_URL}/hello`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default api;