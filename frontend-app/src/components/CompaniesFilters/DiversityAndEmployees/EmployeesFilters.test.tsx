import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EmployeesFilters from './EmployeesFilters';
import { ChakraProvider } from '@chakra-ui/react';
import {
  setEmployeesFrom,
  setEmployeesTo,
  setRevenuePerEmployeeFrom,
  setRevenuePerEmployeeTo,
} from '../../../stores/features';

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('EmployeesFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      discovery: {
        employees: { from: 50, to: 200 },
        revenuePerEmployee: { from: 5000, to: 20000 },
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders EmployeesFilters with correct initial values', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Number of Employees')).toBeInTheDocument();
    expect(screen.getByText('Revenue per employee')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Min')).toHaveValue('50');
    expect(screen.getByPlaceholderText('Max')).toHaveValue('200');
    expect(screen.getByPlaceholderText('$ Min')).toHaveValue('5000');
    expect(screen.getByPlaceholderText('$ Max')).toHaveValue('20000');
  });

  it('dispatches setEmployeesFrom action on "Number of Employees" min input change', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    const employeesMinInput = screen.getByPlaceholderText('Min');

    fireEvent.change(employeesMinInput, { target: { value: '60' } });

    expect(store.dispatch).toHaveBeenCalledWith(setEmployeesFrom(60));
  });

  it('dispatches setEmployeesTo action on "Number of Employees" max input change', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    const employeesMaxInput = screen.getByPlaceholderText('Max');

    fireEvent.change(employeesMaxInput, { target: { value: '180' } });

    expect(store.dispatch).toHaveBeenCalledWith(setEmployeesTo(180));
  });

  it('dispatches setRevenuePerEmployeeFrom action on "Revenue per employee" min input change', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    const revenueMinInput = screen.getByPlaceholderText('$ Min');

    fireEvent.change(revenueMinInput, { target: { value: 7000 } });

    expect(store.dispatch).toHaveBeenCalledWith(setRevenuePerEmployeeFrom(7000));
  });

  it('dispatches setRevenuePerEmployeeTo action on "Revenue per employee" max input change', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    const revenueMaxInput = screen.getByPlaceholderText('$ Max');

    fireEvent.change(revenueMaxInput, { target: { value: 15000 } });

    expect(store.dispatch).toHaveBeenCalledWith(setRevenuePerEmployeeTo(15000));
  });

  it('enforces max constraint on "Number of Employees" min input', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    const employeesMinInput = screen.getByPlaceholderText('Min');

    fireEvent.change(employeesMinInput, { target: { value: '25000' } });

    expect(employeesMinInput).toHaveValue('50');
  });

  it('enforces min constraint on "Revenue per employee" max input', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeesFilters />
        </ChakraProvider>
      </Provider>
    );

    const revenueMaxInput = screen.getByPlaceholderText('$ Max');

    fireEvent.change(revenueMaxInput, { target: { value: '400' } });

    expect(revenueMaxInput).toHaveValue('20000');
  });
});
