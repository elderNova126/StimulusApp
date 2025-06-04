import React from 'react';
import { render, screen } from '@testing-library/react';
import StimNotFoundPage from './index';
import { Router } from '@reach/router';

describe('StimNotFoundPage', () => {
  it('renders correctly with default props', () => {
    render(
      <Router>
        <StimNotFoundPage default />
      </Router>
    );

    expect(screen.getByText('404! Page not found')).toBeInTheDocument();
    expect(screen.getByText('Click here to go back to the home page or wait five seconds')).toBeInTheDocument();
  });
});
