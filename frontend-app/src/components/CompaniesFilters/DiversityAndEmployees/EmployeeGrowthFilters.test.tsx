import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EmployeeGrowthFilters from './EmployeeGrowthFilters';
import { setEmployeesGrowthFrom, setEmployeesGrowthTo } from '../../../stores/features';

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('EmployeeGrowthFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      discovery: {
        employeesGrowth: { from: 10, to: 50 },
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders EmployeeGrowthFilters with correct initial values', () => {
    render(
      <Provider store={store}>
        <EmployeeGrowthFilters />
      </Provider>
    );

    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('% Min')).toHaveValue('10');
    expect(screen.getByPlaceholderText('% Max')).toHaveValue('50');
  });

  it('dispatches setEmployeesGrowthFrom action on min input change', () => {
    render(
      <Provider store={store}>
        <EmployeeGrowthFilters />
      </Provider>
    );

    const minInput = screen.getByPlaceholderText('% Min');

    fireEvent.change(minInput, { target: { value: 15 } });

    expect(store.dispatch).toHaveBeenCalledWith(setEmployeesGrowthFrom(15));
  });

  it('dispatches setEmployeesGrowthTo action on max input change', () => {
    render(
      <Provider store={store}>
        <EmployeeGrowthFilters />
      </Provider>
    );

    const maxInput = screen.getByPlaceholderText('% Max');

    fireEvent.change(maxInput, { target: { value: 55 } });

    expect(store.dispatch).toHaveBeenCalledWith(setEmployeesGrowthTo(55));
  });

  it('does not allow min input to exceed max value', () => {
    render(
      <Provider store={store}>
        <EmployeeGrowthFilters />
      </Provider>
    );

    const minInput = screen.getByPlaceholderText('% Min');

    fireEvent.change(minInput, { target: { value: 600 } });

    expect(minInput).toHaveValue('10');
  });

  it('does not allow max input to be less than min value', () => {
    render(
      <Provider store={store}>
        <EmployeeGrowthFilters />
      </Provider>
    );

    const maxInput = screen.getByPlaceholderText('% Max');

    fireEvent.change(maxInput, { target: { value: 0 } });

    expect(maxInput).toHaveValue('50');
  });
});
