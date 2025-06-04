import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { setBoardTotalFrom, setBoardTotalTo } from '../../../stores/features';
import BoardFilters from './BoardFilters';

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('BoardFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      discovery: {
        boardTotal: { from: 10, to: 50 },
      },
    });

    store.dispatch = jest.fn();
  });

  it('renders BoardFilters component with initial values', () => {
    render(
      <Provider store={store}>
        <BoardFilters />
      </Provider>
    );

    expect(screen.getByPlaceholderText('% Min')).toHaveValue('10');
    expect(screen.getByPlaceholderText('% Max')).toHaveValue('50');
  });

  it('dispatches setBoardTotalFrom action on min input change', () => {
    render(
      <Provider store={store}>
        <BoardFilters />
      </Provider>
    );

    const minInput = screen.getByPlaceholderText('% Min');
    fireEvent.change(minInput, { target: { value: '20' } });

    expect(store.dispatch).toHaveBeenCalledWith(setBoardTotalFrom(20));
  });

  it('dispatches setBoardTotalTo action on max input change', () => {
    render(
      <Provider store={store}>
        <BoardFilters />
      </Provider>
    );

    const maxInput = screen.getByPlaceholderText('% Max');
    fireEvent.change(maxInput, { target: { value: '40' } });

    expect(store.dispatch).toHaveBeenCalledWith(setBoardTotalTo(40));
  });

  it('restricts min input to not exceed max value', () => {
    render(
      <Provider store={store}>
        <BoardFilters />
      </Provider>
    );

    const minInput = screen.getByPlaceholderText('% Min');
    fireEvent.change(minInput, { target: { value: '600' } });

    expect(minInput).toHaveValue('10');
  });

  it('restricts max input to not go below min value', () => {
    render(
      <Provider store={store}>
        <BoardFilters />
      </Provider>
    );

    const maxInput = screen.getByPlaceholderText('% Max');
    fireEvent.change(maxInput, { target: { value: '0' } });

    expect(maxInput).toHaveValue('50');
  });
});
