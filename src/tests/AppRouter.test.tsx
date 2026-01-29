import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppRouter } from '../AppRouter';

// Mock all page components
vi.mock('../pages/Login', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('../pages/Register', () => ({
  default: () => <div>Register Page</div>,
}));

vi.mock('../pages/Help', () => ({
  default: () => <div>Help Page</div>,
}));

vi.mock('../App', () => ({
  App: () => <div>App Component</div>,
}));

// Mock AuthContext
const mockAuthContext = {
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
};

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => mockAuthContext,
}));

describe('AppRouter', () => {
  it('renders without crashing', () => {
    render(<AppRouter />);
    // Should redirect to login since not authenticated
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('shows login page when not authenticated', () => {
    mockAuthContext.isAuthenticated = false;
    render(<AppRouter />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
