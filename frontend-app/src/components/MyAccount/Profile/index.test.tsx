import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { LocationProvider, createHistory, createMemorySource } from '@reach/router';
import { store } from '../../../stores/global';
import Profile from './Profile';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  const history = createHistory(createMemorySource(route));
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    history,
  };
};

describe('Profile component with LoadingScreen', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ loading: false, data: { user: { id: '1', name: 'Test User' } } });
  });

  test('Should display LoadingScreen when loading is true', async () => {
    (useQuery as jest.Mock).mockReturnValue({ loading: true, data: null });

    renderWithRouter(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <Profile />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('Should not display LoadingScreen when loading is false', async () => {
    (useQuery as jest.Mock).mockReturnValue({ loading: false, data: { user: { id: '1', name: 'Test User' } } });

    renderWithRouter(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <Profile />
        </MockedProvider>
      </Provider>
    );

    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });
});
