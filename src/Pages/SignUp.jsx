import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './signup.css';


export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const gotologin = () => {
    navigate('/login');
  }

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email, password }));
    localStorage.setItem('auth', 'true'); // Set auth
    onSignup(); // Update auth state in App
    alert('Registered successfully!');
    navigate('/login'); 
  };

  return (
    <div className="signup-container">
    <h2>Signup</h2>
    <form onSubmit={handleSignup}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
   <p className="inline">
  Already have an account?{' '}
  <span onClick={gotologin} className="font-medium text-blue-700 cursor-pointer inline">
    Login
  </span>
</p>
  </div>
  
  );
}
