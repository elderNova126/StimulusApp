import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StimInput from './index';
import { ChakraProvider } from '@chakra-ui/react';

describe('StimInput Component', () => {
  const renderComponent = (props = {}) => {
    return render(
      <ChakraProvider>
        <StimInput {...props} />
      </ChakraProvider>
    );
  };

  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders label when provided', () => {
    const label = 'Test Label';
    renderComponent({ label });
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  test('renders error message when provided', () => {
    const errorMessage = 'Test Error Message';
    renderComponent({ errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders left icon when provided', () => {
    const leftIcon = <span data-testid="left-icon">Left Icon</span>;
    renderComponent({ leftIcon });
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  test('renders right icon when provided', () => {
    const rightIcon = <span data-testid="right-icon">Right Icon</span>;
    renderComponent({ rightIcon });
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});

export {};
