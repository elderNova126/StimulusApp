import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import Maintenance from './index';

describe('Maintenance Component', () => {
  const renderMaintenance = () => {
    render(
      <ChakraProvider>
        <Maintenance />
      </ChakraProvider>
    );
  };

  test('renders main container', () => {
    renderMaintenance();
    const mainFlex = screen.getByTestId('maintenance-container');
    expect(mainFlex).toBeInTheDocument();
    expect(mainFlex).toHaveStyle({
      height: '100vh',
      overflow: 'hidden',
    });
  });

  test('renders left section with content', () => {
    renderMaintenance();
    // Logo
    const logo = screen.getByRole('img', { name: 'Stimulus Logo' });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'Stimulus Logo');

    // Heading
    const heading = screen.getByText('Application is Currently Unavailable');
    expect(heading).toBeInTheDocument();

    // Text content
    const mainText = screen.getByText('Stimulus is currently under maintenance. We should be back shortly.');
    expect(mainText).toBeInTheDocument();
  });

  test('renders left section with correct styles', () => {
    renderMaintenance();
    const leftSection = screen.getByTestId('left-section');
    expect(leftSection).toHaveStyle({
      width: '50vw',
      height: '100vh',
      backgroundColor: '#E9F8ED',
    });
  });

  test('renders right section with background image', () => {
    renderMaintenance();
    const rightSection = screen.getByTestId('right-section');
    expect(rightSection).toHaveStyle({
      width: '50vw',
      height: '100vh',
    });

    const backgroundImage = screen.getByRole('img', { name: 'Background Chart' });
    expect(backgroundImage).toBeInTheDocument();
    expect(backgroundImage).toHaveAttribute('alt', 'Background Chart');
  });
});
