import LocationFilter from '../CompaniesFilters/BasicFilters/LocationFilters';
import { StatusFilter } from './Basic';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { store } from '../../stores/global';
import { Provider } from 'react-redux';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('LocationFilter', () => {
  it('should render', () => {
    render(
      <Provider store={store}>
        <LocationFilter />
      </Provider>
    );
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('Have a radio', () => {
    render(
      <Provider store={store}>
        <LocationFilter />
      </Provider>
    );
    const radio = screen.getByTestId('location-radio-group');
    expect(radio).toBeInTheDocument();
  });

  it('Have a input', () => {
    render(
      <Provider store={store}>
        <LocationFilter />
      </Provider>
    );
    const input = screen.queryByTestId('location-input');
    expect(input).not.toBeInTheDocument();
  });

  it('Have a checkbox', () => {
    render(
      <Provider store={store}>
        <LocationFilter />
      </Provider>
    );
    const checkbox = screen.getByTestId('location-checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('test checkbox', () => {
    render(
      <Provider store={store}>
        <LocationFilter />
      </Provider>
    );
    const checkbox = screen.getByTestId('location-checkbox');
    act(() => {
      checkbox.click();
    });
    expect(checkbox).toBeInTheDocument();
  });
});

describe('StatusFilter Component', () => {
  it('renders the title "Status"', () => {
    render(
      <Provider store={store}>
        <StatusFilter />
      </Provider>
    );
    const titleElement = screen.getByText('Status');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders 4 checkboxes', () => {
    render(
      <Provider store={store}>
        <StatusFilter />
      </Provider>
    );
    const externalCheckbox = screen.getByTestId('external');
    const activeCheckbox = screen.getByTestId('internal-active');
    const inactiveCheckbox = screen.getByTestId('internal-inactive');
    const archiveCheckbox = screen.getByTestId('internal-archive');

    expect(externalCheckbox).toBeInTheDocument();
    expect(activeCheckbox).toBeInTheDocument();
    expect(inactiveCheckbox).toBeInTheDocument();
    expect(archiveCheckbox).toBeInTheDocument();
  });

  it('toggles checkbox state on click', () => {
    render(
      <Provider store={store}>
        <StatusFilter />
      </Provider>
    );

    const checkboxNames = ['external', 'internal-active', 'internal-inactive', 'internal-archive'];

    checkboxNames.forEach((checkboxName) => {
      const checkbox = screen.getByTestId(checkboxName);
      expect(checkbox).toHaveStyle('background: ""');
      fireEvent.click(checkbox);
      expect(checkbox).toHaveStyle(
        'background: linear-gradient(179.97deg, rgba(176, 226, 187, 0.75) 0.03%, rgba(146, 214, 193, 0.75) 99.97%), #FFFFFF'
      );
    });
  });
});
