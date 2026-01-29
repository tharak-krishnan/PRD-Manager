import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      await login(username, password);
      navigate('/');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Invalid credentials. Please try again.');
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

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <main className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">PRD Manager</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to continue</p>

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

          <div className="mb-6">
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
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
