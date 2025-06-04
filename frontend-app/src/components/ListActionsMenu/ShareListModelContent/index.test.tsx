import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import * as redux from 'react-redux';
import { SharedListStatus } from '../../../graphql/Models/SharedList';
import CollaboratorItem, { IUserItem } from './CollaboratorItem';
import UserItem, { IUserItem as CreatorItem } from './UserItem';

const mockDispatch = jest.fn();
const divWithChildrenMock = (children: any, identifier: string) => <div data-testId={identifier}>{children}</div>;
const divWithoutChildrenMock = (identifier: string) => <div data-testId={identifier} />;

jest.mock('@chakra-ui/react', () => {
  const modules = jest.requireActual('@chakra-ui/react');
  return {
    __esModule: true,
    ...modules,
    PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    AlertDialog: jest.fn(({ children }) => divWithChildrenMock(children, 'modal')),
    ModalOverlay: jest.fn(({ children }) => divWithChildrenMock(children, 'overlay')),
    AlertDialogBody: jest.fn(({ children }) => divWithChildrenMock(children, 'content')),
    AlertDialogHeader: jest.fn(({ children }) => divWithChildrenMock(children, 'header')),
    ModalFooter: jest.fn(({ children }) => divWithChildrenMock(children, 'footer')),
    ModalBody: jest.fn(({ children }) => divWithChildrenMock(children, 'body')),
    ModalCloseButton: jest.fn(() => divWithoutChildrenMock('close')),
  };
});
jest.mock('@chakra-ui/modal', () => {
  const modules = jest.requireActual('@chakra-ui/modal');
  return {
    __esModule: true,
    ...modules,
  };
});
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));
jest.mock('../../../hooks', () => ({
  useAssetUri: () => [
    { profileImageSrc: 'https://myURL.com' },
    function refetch() {
      return Promise.resolve();
    },
  ],
  useUser: () => ({
    user: {
      sub: '',
      given_name: 'given-name',
      family_name: 'family-name',
      tenantCompanyEin: 'test-ein',
    },
  }),
  useTenantCompany: () => ({
    tenantId: '1',
  }),
  useStimulusToast: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

describe('CollaboratorItem Component', () => {
  test('Show approved collaborator', async () => {
    const params: IUserItem = {
      collaborator: {
        id: '1',
        status: SharedListStatus.APPROVED,
        sharedListId: '1',
        givenName: 'test',
        surname: 'test',
      },
      onRemove() {
        return;
      },
      loading: false,
    };
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CollaboratorItem {...params} />
      </MockedProvider>
    );

    const removeOption = screen.getByText('Remove');
    expect(removeOption).toBeInTheDocument();
  });
});

describe('Creator user item Component', () => {
  test('Show creator list', async () => {
    const params: CreatorItem = {
      user: {
        id: '1',
        givenName: 'test',
        surname: 'test',
      },
      onShare(user: string) {
        return;
      },
      isCreator: true,
      loading: false,
    };
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <UserItem {...params} />
      </MockedProvider>
    );

    const labelCreator = screen.getByText('Creator');
    expect(labelCreator).toBeInTheDocument();
  });
});

const mocks: any = [
  {
    collaborators: [
      {
        id: '1',
        givenName: 'given-name',
        surname: 'surname',
        status: SharedListStatus.APPROVED,
      },
    ],
  },
];

const useSelectorMock = jest.spyOn(redux, 'useSelector');
useSelectorMock.mockReturnValue(mocks[0].collaborators);
