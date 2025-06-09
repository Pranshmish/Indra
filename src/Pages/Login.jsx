import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('auth', 'true');
      onLogin();
      navigate('/home');
    } catch (error) {
      console.error('Email login error:', error);
      alert('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('auth', 'true');
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: user.displayName,
          email: user.email,
        })
      );
      onLogin();
      navigate('/home');
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed');
    }
  };

  return (
  <div className="min-h-screen relative overflow-hidden">
  {/* Background Gradient + Effects */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
    {/* Overlay Gradient */}
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse"></div>

    {/* Floating Bubbles */}
    <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
    <div className="absolute bottom-20 right-16 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
    <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>

    {/* Grid Pattern */}
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px'
    }}></div>
  </div>

  {/* Login Form */}
  <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Welcome Back 👋</h2>
        <p className="text-white/70">Login to your account</p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full py-3 px-4 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition duration-300"
        >
          Login
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-white/30" />
        <span className="mx-4 text-white/60 text-sm font-medium">or</span>
        <div className="flex-grow h-px bg-white/30" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center bg-white/90 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 font-medium hover:shadow-md hover:bg-white transition duration-200"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
          {/* Your Google Icon here */}
          <path d="..." />
        </svg>
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-white/80 text-sm">
        Don’t have an account?{' '}
        <button
          onClick={() => navigate('/signup')}
          className="text-blue-300 hover:text-blue-100 font-semibold underline"
        >
          Signup
        </button>
      </p>
    </div>
  </div>
</div>

  );
}
