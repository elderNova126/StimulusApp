import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { PendingInvitationItem } from './PendingInvitationItem/PendingInvitationItem';
import { IPendingListInvitations, PendingListInvitationModal } from './PendingListInvitations';

const mockDispatch = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

describe('PendingInvitationItem Component', () => {
  test('Show pending invitation', async () => {
    const params: any = {
      listInvitation: {
        id: '1',
        companyList: {
          id: '1',
          name: 'test',
        },
      },
    };
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <PendingInvitationItem {...params} />
      </MockedProvider>
    );

    const titleList = screen.getByText(params.listInvitation.companyList.name.toString());
    const acceptOption = screen.getByText('Accept');
    const declineOption = screen.getByText('Decline');

    expect(titleList).toBeInTheDocument();
    expect(acceptOption).toBeInTheDocument();
    expect(declineOption).toBeInTheDocument();
  });
});

describe('PendingInvitationModal component', () => {
  test('Show modal list', async () => {
    const params: IPendingListInvitations = {
      isOpen: true,
      onClose: jest.fn(),
      listInvitations: [],
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <PendingListInvitationModal {...params} />
      </MockedProvider>
    );
    const titleModal = screen.getByText('Pending List Invitations');
    expect(titleModal).toBeInTheDocument();
  });

  test('Show empty list', async () => {
    const params: IPendingListInvitations = {
      isOpen: true,
      onClose: jest.fn(),
      listInvitations: [],
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <PendingListInvitationModal {...params} />
      </MockedProvider>
    );
    const titleModal = screen.getByText('No pending invitations');
    expect(titleModal).toBeInTheDocument();
  });
});
