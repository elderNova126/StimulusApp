import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { LocationProvider, createHistory, createMemorySource } from '@reach/router';
import { store } from '../../stores/global';
import CompanyLog from './CompanyLog';
import { useQuery } from '@apollo/client';
import EventsList from './EventsList';

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

describe('CompanyLog component with LoadingScreen', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ loading: false, data: { company: { id: '1', name: 'Test Company' } } });
  });

  test('Should display LoadingScreen when loading is true', async () => {
    (useQuery as jest.Mock).mockReturnValue({ loading: true, data: null });

    renderWithRouter(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <CompanyLog entityId="1" events={[]} variant={0} />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('Should not display LoadingScreen when loading is false', async () => {
    (useQuery as jest.Mock).mockReturnValue({ loading: false, data: { company: { id: '1', name: 'Test Company' } } });

    renderWithRouter(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <CompanyLog entityId="1" events={[]} variant={0} />
        </MockedProvider>
      </Provider>
    );

    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });
});

describe('EventsList Component', () => {
  test('Should show LoadingScreen when loading for DividedEventsList', () => {
    render(<EventsList notifications={[]} loading={true} variant="DIVIDEDLIST" />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('Should show LoadingScreen when loading for SimpleEventsList', () => {
    render(<EventsList notifications={[]} loading={true} variant="SIMPLELISTO" />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('Should show LoadingScreen when loading for DashboardEventList', () => {
    render(<EventsList notifications={[]} loading={true} variant="DASHBOARDLIST" />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('Should show no notifications message when there are no notifications for SimpleEventsList', () => {
    render(<EventsList notifications={[]} loading={false} variant="SIMPLELISTO" />);
    expect(screen.getByTestId('no-notifications')).toBeInTheDocument();
  });
});
