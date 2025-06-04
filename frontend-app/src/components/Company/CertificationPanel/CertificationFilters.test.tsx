import { render, screen, fireEvent, within } from '@testing-library/react';
import CertificationFilters from './CertificationFilters';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CertificationFilters', () => {
  const mockSetSelectedFilters = jest.fn();
  const mockSetIsOpen = jest.fn();

  const defaultProps = {
    filterHook: [[], mockSetSelectedFilters],
    availableTypes: ['Type1', 'Type2', 'Type3'],
    isOpen: false,
    setIsOpen: mockSetIsOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter button', () => {
    render(<CertificationFilters {...defaultProps} />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('opens popover when filter button is clicked', () => {
    render(<CertificationFilters {...defaultProps} />);
    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('displays available filter types', () => {
    render(<CertificationFilters {...defaultProps} isOpen={true} />);
    defaultProps.availableTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it('selects and deselects filter types', () => {
    const selectedFilters = ['Type1'];
    render(
      <CertificationFilters {...defaultProps} isOpen={true} filterHook={[selectedFilters, mockSetSelectedFilters]} />
    );

    // Click to deselect Type1
    fireEvent.click(screen.getByText('Type1'));
    expect(mockSetSelectedFilters).toHaveBeenCalled();

    // Click to select Type2
    fireEvent.click(screen.getByText('Type2'));
    expect(mockSetSelectedFilters).toHaveBeenCalled();
  });

  it('resets filters when reset button is clicked', () => {
    const selectedFilters = ['Type1'];
    render(
      <CertificationFilters {...defaultProps} isOpen={true} filterHook={[selectedFilters, mockSetSelectedFilters]} />
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(mockSetSelectedFilters).toHaveBeenCalledWith([]);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('shows close icon when filters are selected', () => {
    render(<CertificationFilters {...defaultProps} filterHook={[['Type1'], mockSetSelectedFilters]} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    const closeIcon = within(filterButton).getByTestId('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  it('clears filters when close icon is clicked', () => {
    render(<CertificationFilters {...defaultProps} filterHook={[['Type1'], mockSetSelectedFilters]} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    const closeIcon = within(filterButton).getByTestId('close-icon');
    fireEvent.click(closeIcon);

    expect(mockSetSelectedFilters).toHaveBeenCalledWith([]);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
});
