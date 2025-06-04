import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StimButton from './index';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactElement } from 'react';

const renderWithProviders = (ui: ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('StimButton Component', () => {
  test('renders with default props', () => {
    renderWithProviders(<StimButton>Click Me</StimButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('renders with left icon', () => {
    renderWithProviders(<StimButton leftIcon={<span data-testid="left-icon">L</span>}>Click Me</StimButton>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  test('renders with right icon', () => {
    renderWithProviders(<StimButton rightIcon={<span data-testid="right-icon">R</span>}>Click Me</StimButton>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  test('renders with standalone icon (overrides left/right icons)', () => {
    renderWithProviders(
      <StimButton icon={<span data-testid="icon">Icon</span>} leftIcon={<span>L</span>} rightIcon={<span>R</span>} />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  test('handles click event', async () => {
    const handleClick = jest.fn();
    renderWithProviders(<StimButton onClick={handleClick}>Click Me</StimButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is accessible via role button', () => {
    renderWithProviders(<StimButton>Accessible Button</StimButton>);
    expect(screen.getByRole('button', { name: /accessible button/i })).toBeInTheDocument();
  });
});
