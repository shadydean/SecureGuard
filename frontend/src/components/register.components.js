import React, { useState } from 'react';
import { register } from '../services/auth.services';

const RegisterComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobilenumber, setMobilenumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!email || !password || !mobilenumber || !name) {
      setError('All fields are required');
      return;
    }

    console.log('Sending data:', { email, password, mobilenumber, name });

    try {
      const response = await register(email, password, mobilenumber, name);
      console.log('Registration successful:', response);
      setSuccess('Registration successful!');
      setError(null);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleRegistration}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="tel"
        value={mobilenumber}
        onChange={(e) => setMobilenumber(e.target.value)}
        placeholder="Mobile Number"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterComponent;
