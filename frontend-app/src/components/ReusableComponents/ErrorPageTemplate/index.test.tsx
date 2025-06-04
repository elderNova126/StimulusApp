import React from 'react';
import { render, screen } from '@testing-library/react';
import { navigate } from '@reach/router';
import ErrorPageTemplate from './index';

jest.mock('@reach/router', () => ({
  navigate: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ErrorPageTemplate', () => {
  const title = 'Error Title';
  const message = 'Error Message';

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the error title and message', () => {
    render(<ErrorPageTemplate title={title} message={message} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('navigates to home after 5 seconds', () => {
    render(<ErrorPageTemplate title={title} message={message} />);

    jest.advanceTimersByTime(5000);
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('navigates to home when button is clicked', () => {
    render(<ErrorPageTemplate title={title} message={message} />);

    const button = screen.getByText('Go to Home');
    button.click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
