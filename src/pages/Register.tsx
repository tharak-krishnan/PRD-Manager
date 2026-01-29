import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      // Auto-login after successful registration
      await login(username, password);
      navigate('/');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
    if (fieldErrors.confirmPassword && confirmPassword && value === confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (fieldErrors.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <main className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">Create Account</h1>
        <p className="text-gray-400 text-center mb-8">Join PRD Manager today</p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 mb-2 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border rounded text-gray-100 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.username
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              autoComplete="username"
              aria-invalid={!!fieldErrors.username}
              aria-describedby={fieldErrors.username ? 'username-error' : undefined}
            />
            {fieldErrors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border rounded text-gray-100 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border rounded text-gray-100 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              autoComplete="new-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border rounded text-gray-100 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.confirmPassword
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              autoComplete="new-password"
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            {fieldErrors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
