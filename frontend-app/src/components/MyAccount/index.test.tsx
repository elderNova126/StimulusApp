import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Settings from './Settings';
import AlertQueries from '../../graphql/Queries/NotificationQueries';
import ImageContainer from './Profile/ImageContainer';
import { useUser, useLazyAssetUri } from '../../hooks';
import { useUploadImage, useRemovePhoto } from '../../hooks/assets';
import { useSelector } from 'react-redux';

// Add mock for Azure Storage Blob
jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
  ContainerClient: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks', () => ({
  useUser: jest.fn(),
  useLazyAssetUri: jest.fn(),
}));

jest.mock('../../hooks/assets', () => ({
  useUploadImage: jest.fn(),
  useRemovePhoto: jest.fn(),
}));

jest.mock('../GenericComponents', () => ({
  UserAvatar: jest.fn(() => <div data-testid="avatar" />),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const mockUserData = {
  user: {
    id: 'test-id',
    company_name: 'Test Company',
    exp: 1234567890,
    family_name: 'Doe',
    given_name: 'John',
    iat: 1234567890,
    iss: 'test-issuer',
    job_title: 'Developer',
    nbf: 1234567890,
    nonce: 'test-nonce',
    sub: 'user-123',
  },
};
describe('ImageContainer', () => {
  const mockUploadImage = jest.fn();
  const mockRemovePhoto = jest.fn();
  const mockGetAsset = jest.fn();

  beforeEach(() => {
    (useUser as jest.MockedFunction<typeof useUser>).mockReturnValue(mockUserData);

    (useUploadImage as jest.MockedFunction<typeof useUploadImage>).mockReturnValue({
      uploadProfileImage: mockUploadImage,
      loadingImage: false,
    });

    (useRemovePhoto as jest.MockedFunction<typeof useRemovePhoto>).mockReturnValue({
      deleteProfileimage: mockRemovePhoto,
    });

    (useLazyAssetUri as jest.MockedFunction<typeof useLazyAssetUri>).mockReturnValue([
      mockGetAsset,
      { assetUri: 'http://example.com/avatar.jpg' },
    ]);

    (useSelector as jest.MockedFunction<typeof useSelector>).mockReturnValue(false);
  });

  test('should show avatar when assetUri is available', () => {
    render(<ImageContainer />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  test('should disable remove button when no assetUri', () => {
    (useLazyAssetUri as jest.MockedFunction<typeof useLazyAssetUri>).mockReturnValue([
      mockGetAsset,
      { assetUri: null },
    ]);
    render(<ImageContainer />);
    expect(screen.getByTestId('remove-photo-button')).toBeDisabled();
  });
});

jest.mock('../LoadingScreen', () => () => <div data-testid="loading-screen" />);

const { NOTIFICATIONS_PROFILE_LIST_GQL } = AlertQueries;

const mocks = [
  {
    request: {
      query: NOTIFICATIONS_PROFILE_LIST_GQL,
    },
    result: {
      data: {
        notifications: [
          { id: '1', name: 'Notification 1', enabled: true },
          { id: '2', name: 'Notification 2', enabled: false },
        ],
      },
    },
  },
];

describe('Settings Component', () => {
  test('Should show LoadingScreen when loading is true', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Settings />
      </MockedProvider>
    );
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });
});
