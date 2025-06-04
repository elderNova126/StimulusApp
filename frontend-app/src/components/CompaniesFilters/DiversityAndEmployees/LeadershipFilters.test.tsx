import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LeadershipFilters from './LeadershipFilters';
import { setLeadershipTeamTotalFrom, setLeadershipTeamTotalTo } from '../../../stores/features';

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('LeadershipFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      discovery: {
        leadershipTeamTotal: { from: 10, to: 50 },
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders LeadershipFilters with correct initial values', () => {
    render(
      <Provider store={store}>
        <LeadershipFilters />
      </Provider>
    );

    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('% Min')).toHaveValue('10');
    expect(screen.getByPlaceholderText('% Max')).toHaveValue('50');
  });

  it('dispatches setLeadershipTeamTotalFrom action on min input change', () => {
    render(
      <Provider store={store}>
        <LeadershipFilters />
      </Provider>
    );

    const minInput = screen.getByPlaceholderText('% Min');

    fireEvent.change(minInput, { target: { value: '15' } });

    expect(store.dispatch).toHaveBeenCalledWith(setLeadershipTeamTotalFrom(15));
  });

  it('dispatches setLeadershipTeamTotalTo action on max input change', () => {
    render(
      <Provider store={store}>
        <LeadershipFilters />
      </Provider>
    );

    const maxInput = screen.getByPlaceholderText('% Max');

    fireEvent.change(maxInput, { target: { value: '55' } });

    expect(store.dispatch).toHaveBeenCalledWith(setLeadershipTeamTotalTo(55));
  });
});
