import React from 'react';
import { render, screen } from '@testing-library/react';
import StimErrorPage from './index';
import ErrorPageTemplate from '../ErrorPageTemplate';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../ErrorPageTemplate', () => jest.fn(() => <div>ErrorPageTemplate Mock</div>));

describe('StimErrorPage', () => {
  it('renders the error message', () => {
    render(<StimErrorPage />);

    expect(screen.getByText('ErrorPageTemplate Mock')).toBeInTheDocument();
  });

  it('passes the correct props to ErrorPageTemplate', () => {
    render(<StimErrorPage />);

    expect(ErrorPageTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        message:
          'There was an unexpected error, please try again. Click here to go back to the home page or wait five seconds',
      }),
      {}
    );
  });
});
