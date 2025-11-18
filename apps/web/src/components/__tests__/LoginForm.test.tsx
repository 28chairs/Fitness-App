import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../auth/LoginForm';
import { useAuthStore } from '@/lib/store/auth-store';

jest.mock('@/lib/store/auth-store');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });
  });

  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});

