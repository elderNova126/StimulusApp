import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ContingenciesFilters from './ContingenciesFilters';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ContingenciesFilters', () => {
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
    cleanup(); // Add cleanup between tests
  });

  it('renders Filter button in default state', () => {
    render(<ContingenciesFilters {...defaultProps} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
    expect(filterButton).toHaveClass('chakra-button');
    expect(filterButton).toBeTruthy();
  });

  it('renders Filter button in active state when popover is open', () => {
    render(<ContingenciesFilters {...defaultProps} isOpen={true} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeTruthy();
    expect(filterButton).toHaveClass('chakra-button');
  });

  it('calls setIsOpen when Filter button is clicked', () => {
    render(<ContingenciesFilters {...defaultProps} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('renders Reset button in popover and handles click', () => {
    render(<ContingenciesFilters {...defaultProps} isOpen={true} />);

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockSetSelectedFilters).toHaveBeenCalledWith([]);
  });

  it('shows close icon when filters are selected', () => {
    const selectedFilters = ['Type1'];
    render(<ContingenciesFilters {...defaultProps} filterHook={[selectedFilters, mockSetSelectedFilters]} />);

    const closeIcon = screen.getByTestId('close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  it('clears filters when close icon is clicked', () => {
    const selectedFilters = ['Type1'];
    render(<ContingenciesFilters {...defaultProps} filterHook={[selectedFilters, mockSetSelectedFilters]} />);

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.click(closeIcon);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockSetSelectedFilters).toHaveBeenCalledWith([]);
  });

  it('toggles filter selection when type is clicked', () => {
    const { rerender } = render(<ContingenciesFilters {...defaultProps} isOpen={true} />);

    // Select a filter
    const type1Option = screen.getByText('Type1', { selector: '.chakra-text' });
    fireEvent.click(type1Option);

    // Get the callback function that was passed to setSelectedFilters
    const callback = mockSetSelectedFilters.mock.calls[0][0];
    // Call the callback with an empty array to simulate the current state
    const result = callback([]);
    // Verify the callback returns the correct array
    expect(result).toEqual(['Type1']);

    // Setup mock for deselection using rerender instead of new render
    const selectedFilters = ['Type1'];
    rerender(
      <ContingenciesFilters {...defaultProps} isOpen={true} filterHook={[selectedFilters, mockSetSelectedFilters]} />
    );

    // Deselect the filter - now using a more specific selector
    const selectedType1 = screen.getByText('Type1', { selector: '.chakra-text' });
    fireEvent.click(selectedType1);
    const deselectionCallback = mockSetSelectedFilters.mock.calls[1][0];
    const deselectionResult = deselectionCallback(['Type1']);
    expect(deselectionResult).toEqual([]);
  });

  it('applies correct styles to selected filter types', () => {
    const selectedFilters = ['Type1'];
    render(
      <ContingenciesFilters {...defaultProps} isOpen={true} filterHook={[selectedFilters, mockSetSelectedFilters]} />
    );

    const selectedType = screen.getByText('Type1');
    expect(selectedType).toHaveStyle({
      fontWeight: 'bold',
      color: 'green.600',
    });

    const unselectedType = screen.getByText('Type2');
    expect(unselectedType).not.toHaveStyle({
      fontWeight: 'bold',
      color: 'green.600',
    });
  });
});
