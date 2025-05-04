import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';


export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email, password }));
    localStorage.setItem('auth', 'true'); // Set auth
    onSignup(); // Update auth state in App
    alert('Registered successfully!');
    navigate('/home'); // Navigate to home after signup
  };

  return (
    <div className="signup-container">
    <h2>Signup</h2>
    <form onSubmit={handleSignup}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
    <p>Already have an account? <a href="/login">Login</a></p>
  </div>
  
  );
}
