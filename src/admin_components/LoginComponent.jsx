import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Main App Component

// Login Component
const LoginComponent = () => {

  const navigate = useNavigate();

  // State to manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
 const handleLogin = (e) => {
  e.preventDefault(); // prevent page refresh

  // Simulate validation or API login logic
  if (email === 'admin@example.com' && password === '123456') {
    // optional: set success message
    setSuccess('Login successful!');
    setError('');

    // Delay navigation just for UX (optional)
    setTimeout(() => {
      navigate('/admin'); // 👈 redirect to /admin after login
    }, 500);
  } else {
    setError('Invalid credentials');
    setSuccess('');
  }
};



  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-full max-w-md p-8 mx-10 space-y-8 bg-white group-[.dark-mode]:bg-gray-800 group[.dark-mode]:bg-gray-800 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="text-center">
          <h1 className="text-4xl poppins-bold gd-text mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin} >
          {/* Email Input */}
          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  text-lt placeholder-gray-400 border border-gray-600 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full  text-lt placeholder-gray-400 border border-gray-600 rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-white transition-colors"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          {success && <div className="text-green-400 text-sm text-center">{success}</div>}


          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:-translate-y-1 transition-all duration-300"

          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};


export default LoginComponent;
