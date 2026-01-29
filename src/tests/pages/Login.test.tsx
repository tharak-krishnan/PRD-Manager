import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from '../../pages/Login';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
    register: vi.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('Login', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText(/PRD Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Username/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
  });

  it('has a sign in button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('has a link to register', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText(/create one/i)).toBeInTheDocument();
  });

  it('has input fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
