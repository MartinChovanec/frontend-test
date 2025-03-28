import { act, render, screen, waitFor } from '@testing-library/react';
import UsersPage from './page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        users: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            image: 'https://example.com/avatar.jpg',
            status: 'online',
            role: 'Admin',
            lastActive: '2025-03-23T08:23:00.000Z',
            loginHistory: [
              { id: 1, date: '2025-03-23T08:23:00.000Z', device: 'desktop', browser: 'Chrome', ip: '11234.543' },
              { id: 2, date: '2025-03-22T08:23:00.000Z', device: 'desktop', browser: 'Chrome', ip: '11234.543' },
              { id: 3, date: '2025-03-21T08:23:00.000Z', device: 'desktop', browser: 'Chrome', ip: '11234.543' },
              { id: 4, date: '2025-03-20T08:23:00.000Z', device: 'desktop', browser: 'Chrome', ip: '11234.543' },
              { id: 5, date: '2025-03-19T08:23:00.000Z', device: 'desktop', browser: 'Chrome', ip: '11234.543' },
            ],
          },
        ],
      }),
  })
) as jest.Mock;



describe('UsersPage', () => {
  it('renders loading state initially', () => {
    render(<UsersPage />);
    expect(screen.getByText('Načítání...')).toBeInTheDocument();
  });

  it('renders user data after fetch', async () => {
    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() => {
      const nameElements = screen.getAllByText('John Doe');
      expect(nameElements.length).toBeGreaterThan(0);
    });
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders suspicious users section', async () => {
    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() =>
      expect(screen.getByText('List of suspicious users')).toBeInTheDocument()
    );
    expect(screen.getByText('No suspicious user')).toBeInTheDocument();
  });

  it('renders login trend chart section', async () => {
    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() =>
      expect(screen.getByText('Overall login trend')).toBeInTheDocument()
    );
  });
});
