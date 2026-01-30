import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';

vi.mock('../../services/api', () => ({
  apiClient: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="auth">{auth.isAuthenticated ? 'yes' : 'no'}</div>
      <button onClick={() => auth.login('u', 'p')}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
      <button onClick={() => auth.register('u', 'e', 'p')}>Register</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('throws error outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });

  it('renders provider', () => {
    vi.mocked(apiClient.getCurrentUser).mockResolvedValue(null);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth')).toHaveTextContent('no');
  });

  it('handles login', async () => {
    vi.mocked(apiClient.getCurrentUser).mockResolvedValue(null);
    vi.mocked(apiClient.login).mockResolvedValue({
      access_token: 'token',
      user: { id: 1, username: 'user', email: 'e' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });
    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalled();
    });
  });

  it('handles register', async () => {
    vi.mocked(apiClient.getCurrentUser).mockResolvedValue(null);
    vi.mocked(apiClient.register).mockResolvedValue({ message: 'ok' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });
    await waitFor(() => {
      expect(apiClient.register).toHaveBeenCalled();
    });
  });

  it('handles logout', async () => {
    delete (window as any).location;
    window.location = { href: '' } as any;
    vi.mocked(apiClient.getCurrentUser).mockResolvedValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => screen.getByTestId('auth'));

    await act(async () => {
      screen.getByText('Logout').click();
    });
    expect(window.location.href).toBe('/login');
  });
});
