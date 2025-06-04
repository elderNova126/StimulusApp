import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DiversityAndEmployeesFilters from './DiversityAndEmployeesFilters';

jest.mock('./BoardFilters', () => () => <div data-testid="BoardFilters" />);
jest.mock('./DiversityFilters', () => () => <div data-testid="DiversityFilters" />);
jest.mock('./MinorityFilters', () => () => <div data-testid="MinorityFilters" />);
jest.mock('./EmployeesFilters', () => () => <div data-testid="EmployeesFilters" />);
jest.mock('./LeadershipFilters', () => () => <div data-testid="LeadershipFilters" />);
jest.mock('./EmployeeGrowthFilters', () => () => <div data-testid="EmployeeGrowthFilters" />);

const mockStore = configureStore([]);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('DiversityAndEmployeesFilters Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({});
  });

  it('renders the component with all filters', () => {
    render(
      <Provider store={store}>
        <DiversityAndEmployeesFilters />
      </Provider>
    );

    expect(screen.getByText(/Ownership & Employees/i)).toBeInTheDocument();

    expect(screen.getByTestId('DiversityFilters')).toBeInTheDocument();
    expect(screen.getByTestId('MinorityFilters')).toBeInTheDocument();
    expect(screen.getByTestId('EmployeesFilters')).toBeInTheDocument();
    expect(screen.getByTestId('BoardFilters')).toBeInTheDocument();
    expect(screen.getByTestId('LeadershipFilters')).toBeInTheDocument();
    expect(screen.getByTestId('EmployeeGrowthFilters')).toBeInTheDocument();
  });

  it('renders layout elements correctly', () => {
    render(
      <Provider store={store}>
        <DiversityAndEmployeesFilters />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ownership & Employees');
    expect(screen.getByTestId('DiversityFilters')).toBeInTheDocument();
    expect(screen.getByTestId('MinorityFilters')).toBeInTheDocument();
  });
});
