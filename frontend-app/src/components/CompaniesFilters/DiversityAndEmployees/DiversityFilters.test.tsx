import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DiversityFilters from './DiversityFilters';
import { MockedProvider } from '@apollo/client/testing';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { setDiverseOwnership } from '../../../stores/features';

const { GET_COMPANY_DIVERSE_OWNERSHIP } = CompanyQueries;

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mocks = [
  {
    request: {
      query: GET_COMPANY_DIVERSE_OWNERSHIP,
    },
    result: {
      data: {
        getCompanyDistinctDiverseOwnership: {
          diverseOwnership: ['Women', 'LGBTQ', 'Disabled'],
        },
      },
    },
  },
];

describe('DiversityFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      discovery: {
        diverseOwnership: [],
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders Ownership heading and checkboxes', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <DiversityFilters />
        </MockedProvider>
      </Provider>
    );

    expect(await screen.findByText('Ownership')).toBeInTheDocument();

    expect(await screen.findByText('Women')).toBeInTheDocument();
    expect(screen.getByText('LGBTQ')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('dispatches setDiverseOwnership action when a checkbox is clicked', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <DiversityFilters />
        </MockedProvider>
      </Provider>
    );

    const checkboxWomen = await screen.findByText('Women');
    fireEvent.click(checkboxWomen);
    expect(store.dispatch).toHaveBeenCalledWith(setDiverseOwnership(['Women']));
  });

  it('splits ownership items evenly between columns', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <DiversityFilters />
        </MockedProvider>
      </Provider>
    );

    const firstColumnItems = await screen.findAllByText(/Women|LGBTQ/);
    const secondColumnItems = screen.getAllByText(/Disabled/);

    expect(firstColumnItems.length).toBeGreaterThan(0);
    expect(secondColumnItems.length).toBeGreaterThan(0);
  });
});
