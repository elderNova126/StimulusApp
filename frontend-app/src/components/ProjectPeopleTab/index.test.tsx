import { MockedProvider } from '@apollo/client/testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserQueries from '../../graphql/Queries/UserQueries';
import ProjectPeopleInviteModal from './ProjectPeopleInviteModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Project invitation modal Component', () => {
  const usersInvited = [
    {
      id: '1',
      givenName: 'User 1',
      surname: 'Surname 1',
      email: 'mail user 1',
    },
    {
      id: '2',
      givenName: 'User 2',
      surname: 'Surname 2',
      email: 'mail user 2',
    },
  ];

  const response = {
    getUserByName: {
      results: [
        {
          __typename: 'UserProfileResult',
          id: '1',
          externalAuthSystemId: '1',
          tenant: null,
          givenName: 'user 2',
          surname: 'surname 2',
          email: 'mail user 2',
          jobTitle: 'sdf',
          mobilePhone: null,
          accountEnabled: true,
        },
        {
          __typename: 'UserProfileResult',
          id: '222DB148-77C5-EC11-997E-0003FFD75239',
          externalAuthSystemId: '2',
          tenant: null,
          givenName: 'user 1',
          surname: 'surname 1',
          email: 'mail user 1',
          jobTitle: 'qa',
          mobilePhone: '345454',
          accountEnabled: true,
        },
      ],
    },
  };

  const mockQueryResponse = [
    {
      request: {
        query: UserQueries.GET_USER_BY_NAME,
      },
      result: {
        data: response,
      },
    },
  ];

  test('Show invitation modal with pending users', async () => {
    render(
      <MockedProvider mocks={mockQueryResponse} addTypename={false}>
        <ProjectPeopleInviteModal invitedUsers={usersInvited} isOpen={true} onClose={() => ''} projectId={1} />
      </MockedProvider>
    );

    const titleModal = screen.getByText('Invite User');
    expect(titleModal).toBeInTheDocument();

    for (const user of usersInvited) {
      await waitFor(() => {
        expect(screen.getByText(user.email as string)).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText(`${user.givenName} ${user.surname}`)).toBeInTheDocument();
      });
    }
  });

  test('search input', async () => {
    render(
      <MockedProvider mocks={mockQueryResponse} addTypename={false}>
        <ProjectPeopleInviteModal invitedUsers={usersInvited} isOpen={true} onClose={() => ''} projectId={1} />
      </MockedProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search Connections');
    expect(searchInput).toBeInTheDocument();

    const inputValue = 'test search input';
    fireEvent.change(searchInput, { target: { value: inputValue } });

    await waitFor(() => {
      expect(searchInput).toHaveValue(inputValue);
    });
  });
});
