import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Register from '../../pages/Register';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockRegister = vi.fn();
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
    register: mockRegister,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('Register', () => {
  it('renders registration form', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('has password labels', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('has a create account button', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('has a link to login', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
