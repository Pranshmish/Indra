import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from './../firebase'; // Firebase setup
import './Login.css';

export default function Login({ onLogin, onUserNotFound }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
      alert('User not found. Redirecting to signup...');
      onUserNotFound(); // Tell App to redirect to signup
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      localStorage.setItem('auth', 'true');
      onLogin(); // Tell App user is authenticated
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem('auth', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: user.displayName,
        email: user.email
      }));

      onLogin(); // Tell App user is authenticated
      navigate('/home');
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>

      <hr />

      <button className="google-login-btn" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>

      <p>Don't have an account? <a href="/signup">Signup</a></p>
    </div>
  );
}
