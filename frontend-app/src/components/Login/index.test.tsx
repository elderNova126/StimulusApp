import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Login component', () => {
  const loginComponent = <Login />;
  test('Should contain Login container', async () => {
    const view = render(loginComponent);
    expect(view).toBeDefined();
  });

  test('Should contain static text', async () => {
    render(loginComponent);
    expect(screen.getByText('Stimulus')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('Should contain CardMedia component', async () => {
    render(loginComponent);
    const cardMedia = screen.getByTestId('cardMedia');
    expect(cardMedia).toBeInTheDocument();
    expect(cardMedia).toHaveAttribute('style', 'background-image: url(/desk.jpg);');
  });
});
