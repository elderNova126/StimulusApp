import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogFilters from './LogFilters';
import { ChakraProvider } from '@chakra-ui/react';
import { getLastWeekDate } from '../../../utils/date';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('LogFilters', () => {
  const mockApplyFilters = jest.fn();
  const defaultProps = {
    count: 10,
    applyFilters: mockApplyFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithChakra = (ui: React.ReactElement) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  const openPopover = async () => {
    const filterButton = screen.getByTestId('filters-trigger-button');
    fireEvent.click(filterButton);
    const popoverContent = screen.getByTestId('popover-content');
    await waitFor(() => {
      expect(popoverContent).toBeInTheDocument();
    });
    return popoverContent;
  };

  describe('Filter Button States', () => {
    it('renders with stimTextButton variant by default', () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      const filterButton = screen.getByTestId('filters-trigger-button');
      expect(filterButton).toHaveClass('chakra-button');
      expect(filterButton).toHaveAttribute('data-variant', 'stimTextButton');
    });

    it('changes to stimPrimary variant when popover is open', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();
      const filterButton = screen.getByTestId('filters-trigger-button');
      expect(filterButton).toHaveAttribute('data-variant', 'stimPrimary');
    });

    it('shows correct filter count in button text', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();

      // Select some dates to add filters
      const { startInput, endInput } = getDateInputs();
      fireEvent.change(startInput, { target: { value: '01/01/2024' } });
      fireEvent.change(endInput, { target: { value: '01/31/2024' } });

      const applyButton = screen.getByTestId('apply-filters-button');
      expect(applyButton).toHaveTextContent('Apply filters (2)');
    });
  });

  describe('Reset Button', () => {
    it('has stimTextButton variant', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();
      const resetButton = screen.getByTestId('reset-filters-button');
      expect(resetButton).toHaveClass('chakra-button');
      expect(resetButton).toHaveAttribute('data-variant', 'stimTextButton');
    });

    it('resets all filters when clicked', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();

      const resetButton = screen.getByTestId('reset-filters-button');
      fireEvent.click(resetButton);

      expect(mockApplyFilters).toHaveBeenCalledWith({
        timestampFrom: expect.any(Date),
        timestampTo: expect.any(Date),
      });
    });
  });

  describe('Apply Button', () => {
    it('has stimOutline variant and stimSmall size', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();
      const applyButton = screen.getByTestId('apply-filters-button');
      expect(applyButton).toHaveClass('chakra-button');
      expect(applyButton).toHaveAttribute('data-variant', 'stimOutline');
      expect(applyButton).toHaveAttribute('data-size', 'stimSmall');
    });

    it('closes popover when clicked', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();

      const applyButton = screen.getByTestId('apply-filters-button');
      fireEvent.click(applyButton);

      const popoverContent = screen.getByTestId('popover-content');
      await waitFor(() => {
        expect(popoverContent).toHaveStyle({ visibility: 'hidden' });
      });
    });

    it('applies filters with correct dates', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();

      const { startInput, endInput } = getDateInputs();
      fireEvent.change(startInput, { target: { value: '01/01/2024' } });
      fireEvent.change(endInput, { target: { value: '01/31/2024' } });

      const applyButton = screen.getByTestId('apply-filters-button');
      fireEvent.click(applyButton);

      expect(mockApplyFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          timestampFrom: expect.any(Date),
          timestampTo: expect.any(Date),
        })
      );
    });
  });

  describe('Date Handling', () => {
    it('initializes with last week date and current date', () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      const lastWeek = getLastWeekDate();
      const today = new Date();

      expect(mockApplyFilters).not.toHaveBeenCalled();

      // Open popover to check initial dates
      const filterButton = screen.getByTestId('filters-trigger-button');
      fireEvent.click(filterButton);

      const { startInput, endInput } = getDateInputs();
      expect(startInput).toHaveValue(formatDate(lastWeek));
      expect(endInput).toHaveValue(formatDate(today));
    });

    it('maintains date state between popover opens', async () => {
      renderWithChakra(<LogFilters {...defaultProps} />);
      await openPopover();

      const { startInput } = getDateInputs();
      const testDate = '01/01/2024';
      fireEvent.change(startInput, { target: { value: testDate } });

      // Close and reopen popover
      fireEvent.click(document.body);
      await openPopover();

      const { startInput: reopenedStartInput } = getDateInputs();
      expect(reopenedStartInput).toHaveValue(testDate);
    });
  });
});

// Helper function to format dates consistently
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

// Helper function to get date inputs
const getDateInputs = () => {
  const inputs = screen.getAllByPlaceholderText('MM/DD/YYY');
  const startInput = inputs[0];
  const endInput = inputs[1];

  return { startInput, endInput };
};
