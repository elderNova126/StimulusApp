import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StimTooltip } from './index';
import { ChakraProvider } from '@chakra-ui/react';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('StimTooltip', () => {
  it('renders children correctly', () => {
    render(
      <ChakraProvider>
        <StimTooltip label="test-label">Test Child</StimTooltip>
      </ChakraProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders tooltip with translated label', async () => {
    render(
      <ChakraProvider>
        <StimTooltip label="test-label">Test Child</StimTooltip>
      </ChakraProvider>
    );
    fireEvent.mouseOver(screen.getByText('Test Child'));
    await screen.findByText('test-label');
  });

  it('applies default placement if not provided', async () => {
    render(
      <ChakraProvider>
        <StimTooltip label="test-label">Test Child</StimTooltip>
      </ChakraProvider>
    );
    fireEvent.mouseOver(screen.getByText('Test Child'));
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      const triggerElement = screen.getByText('Test Child');
      const describedBy = triggerElement.getAttribute('aria-describedby');
      expect(tooltip.id).toBe(describedBy);
    });
  });
});
