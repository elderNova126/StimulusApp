import { act, render, screen } from '@testing-library/react';
import NotFound from '.';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

describe('NotFound component', () => {
  test('Should be defined and contain 404', async () => {
    i18n.use(initReactI18next).init({
      resources: {
        en: {},
      },
      lng: 'en',
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },
    });
    const view = render(<NotFound />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(view).toBeDefined();

    expect(screen.getByText('404! Page not found ', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Click here', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(' to go back to the home page or wait five seconds', { exact: false })).toBeInTheDocument();
  });
});
