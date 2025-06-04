import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import CustomDiscoveryFiltersPanel from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const customDiscoveryFiltersPanelComponent = <CustomDiscoveryFiltersPanel />;
describe('CustomDiscoveryFiltersPanel component', () => {
  test('Should contain component', async () => {
    const view = render(customDiscoveryFiltersPanelComponent);
    expect(view).toBeDefined();
  });

  test('Should contain subtitle', async () => {
    render(customDiscoveryFiltersPanelComponent);
    expect(screen.getByText('CUSTOM FILTER')).toBeInTheDocument();
  });
});

describe('FilterPanel component', () => {
  test('Should contain Organization filter', async () => {
    render(customDiscoveryFiltersPanelComponent);

    expect(screen.getByText('Organization')).toBeInTheDocument();
    const organizationFilter = screen.getByTestId('organization-filter');
    expect(organizationFilter).toBeInTheDocument();

    // Organization Type
    expect(screen.getByText('Organization Type')).toBeInTheDocument();

    // Field of Interests
    expect(within(organizationFilter).getByText('Field of Interests')).toBeInTheDocument();

    // Organizational Age
    expect(screen.getByText('Organizational Age')).toBeInTheDocument();

    // Leadership/Race
    expect(screen.getByText('Leadership/Race')).toBeInTheDocument();

    const sliderTitle = within(organizationFilter).getAllByText('How important is it fit in your search?');
    expect(sliderTitle).toHaveLength(4);
    const select = within(organizationFilter).getAllByTestId('select-filter-field');
    expect(select).toHaveLength(4);
    fireEvent.change(select[0], 'Non-profit');
    expect(select[0]).toHaveValue('Non-profit');
  });

  test('Should contain Location filter', async () => {
    render(customDiscoveryFiltersPanelComponent);

    expect(screen.getByText('Location')).toBeInTheDocument();
    const locationFilter = screen.getByTestId('location-filter');
    expect(locationFilter).toBeInTheDocument();

    expect(screen.getByText('State')).toBeInTheDocument();

    expect(screen.getByText('City')).toBeInTheDocument();

    const sliderTitle = within(locationFilter).getAllByText('How important is it fit in your search?');
    expect(sliderTitle).toHaveLength(2);
    const select = within(locationFilter).getAllByTestId('select-filter-field');
    expect(select).toHaveLength(2);
    fireEvent.change(select[0], 'Pennsylvania');
    expect(select[0]).toHaveValue('Pennsylvania');
  });

  test('Should contain Location filter in Program', async () => {
    render(customDiscoveryFiltersPanelComponent);

    expect(screen.getByText('Program Profile')).toBeInTheDocument();
    const programProfileFilter = screen.getByTestId('programProfile-filter');
    expect(programProfileFilter).toBeInTheDocument();

    expect(screen.getByText('Program Type')).toBeInTheDocument();

    expect(within(programProfileFilter).getByText('Field of Interests')).toBeInTheDocument();

    expect(screen.getByText('Type of Support')).toBeInTheDocument();

    expect(screen.getByText('Number of Employees')).toBeInTheDocument();

    const sliderTitle = within(programProfileFilter).getAllByText('How important is it fit in your search?');
    expect(sliderTitle).toHaveLength(4);
    const select = within(programProfileFilter).getAllByTestId('select-filter-field');
    expect(select).toHaveLength(4);
    fireEvent.change(select[0], 'Grant');
    expect(select[0]).toHaveValue('Grant');
  });
});
