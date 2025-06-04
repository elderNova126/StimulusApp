import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedProvider } from '@apollo/client/testing';
import MinorityFilters from './MinorityFilters';
import { setMinorityOwnership } from '../../../stores/features';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('MinorityFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  const mocks = [
    {
      request: {
        query: CompanyQueries.GET_MINORITY_OWNERSHIP_DETAIL,
      },
      result: {
        data: {
          getMinorityOwnership: [
            { id: '1', minorityOwnershipDetail: 'Women', displayName: 'Women' },
            { id: '2', minorityOwnershipDetail: 'LGBTQ+', displayName: 'LGBTQ+' },
            { id: '3', minorityOwnershipDetail: 'Veterans', displayName: 'Veterans' },
          ],
        },
      },
    },
  ];

  beforeEach(() => {
    store = mockStore({
      discovery: {
        minorityOwnership: [],
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders MinorityFilters with correct items from GraphQL query', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MinorityFilters />
        </MockedProvider>
      </Provider>
    );

    expect(await screen.findByText('Women')).toBeInTheDocument();
    expect(screen.getByText('LGBTQ+')).toBeInTheDocument();
    expect(screen.getByText('Veterans')).toBeInTheDocument();
  });

  it('toggles an item in the minorityOwnership list when clicked', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MinorityFilters />
        </MockedProvider>
      </Provider>
    );

    const womenCheckbox = await screen.findByText('Women');

    fireEvent.click(womenCheckbox);
    expect(store.dispatch).toHaveBeenCalledWith(setMinorityOwnership(['Women']));
  });
});
