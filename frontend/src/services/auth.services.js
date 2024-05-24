import axios from 'axios';

const API_URL = 'http://localhost:4321/api';

export const register = async (email, password, mobilenumber, name) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      email,
      password,
      mobilenumber,
      name, // Ensure this matches the backend field
    });
    console.log('Backend response:', response.data); // Log the backend response
    return response.data;
  } catch (err) {
    console.error('Error from backend:', err.response.data); // Log the error response from the backend
    throw err.response.data;
  }
};
