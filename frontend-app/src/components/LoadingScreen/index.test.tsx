import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import LoadingScreen from './index';

const renderLoadingScreen = () => {
  render(
    <ChakraProvider>
      <LoadingScreen />
    </ChakraProvider>
  );
};

describe('LoadingScreen Component', () => {
  test('renders LoadingScreen component', () => {
    renderLoadingScreen();
    const loadingScreen = screen.getByTestId('loading-screen');
    expect(loadingScreen).toBeInTheDocument();
  });

  test('Flex container has correct layout properties', () => {
    renderLoadingScreen();
    const flexContainer = screen.getByTestId('loading-screen');
    expect(flexContainer).toHaveStyle({
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    });
  });

  test('Image element has correct properties', () => {
    renderLoadingScreen();
    const imageElement = screen.getByRole('img');
    expect(window.getComputedStyle(imageElement).position).toBe('absolute');
  });

  test('Image has correct source and alt attributes', () => {
    renderLoadingScreen();
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('alt', 'human');
  });
});
