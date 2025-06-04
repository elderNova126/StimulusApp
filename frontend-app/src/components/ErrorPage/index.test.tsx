import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorPage from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Error Page component', () => {
  test('Should contains stimulus logo', async () => {
    render(<ErrorPage />);
    const imgLogo = screen.getByAltText('Stimulus Logo');

    expect(imgLogo).toBeInTheDocument();
  });

  test('Should contains error messages', async () => {
    render(<ErrorPage />);

    const errorText = screen.getByText('There was an unexpected error, please try again.', { exact: false });
    const goBackText = screen.getByText('to go back to the home page or wait five seconds', { exact: false });

    expect(errorText).toBeInTheDocument();
    expect(goBackText).toBeInTheDocument();
  });
});
