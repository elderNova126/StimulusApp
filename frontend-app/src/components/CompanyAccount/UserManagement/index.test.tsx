import React from 'react';
import { render, screen } from '@testing-library/react';
import TableUsers from './TableUsers';
import { store } from '../../../stores/global';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import PendingTable from './PendingTable';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('UserManagement Component', () => {
  it('renders right columns and user data', () => {
    const mockUser = {
      id: 1,
      givenName: 'given name',
      surname: 'surname',
      email: 'email@example.com',
      accountEnabled: true,
      jobTitle: 'developer',
    };

    render(
      <Provider store={store}>
        <MockedProvider>
          <TableUsers
            currentPosts={[mockUser] as any}
            setUserToEdit={() => {}}
            setUserToRemove={() => {}}
            loadingUsers={false}
          />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByText('TITLE')).toBeInTheDocument();

    expect(screen.getByText('given name surname')).toBeInTheDocument();
    expect(screen.getByText('email@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('developer')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('renders right pending user data', () => {
    const mockPendingUsers = [
      {
        id: 1,
        email: 'emailtest1@example.com',
      },
    ];

    render(
      <Provider store={store}>
        <MockedProvider>
          <PendingTable pendingUsers={mockPendingUsers as any} setInvitationToResend={() => {}} />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByText('emailtest1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Resend')).toBeInTheDocument();
  });
});
