import { render, screen } from '@testing-library/react';
import CompanyRegistrationLayout from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('CompanyRegistrationLayout component', () => {
  test('Should render static text', async () => {
    render(
      <CompanyRegistrationLayout title="test title" stepText="test stepText" subtitle="test subtitle">
        <span data-testid="children">test</span>
      </CompanyRegistrationLayout>
    );
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByAltText('STIMULUS')).toBeInTheDocument();
  });

  test('Should render props text', async () => {
    render(
      <CompanyRegistrationLayout title="test title" stepText="test stepText" subtitle="test subtitle">
        <span data-testid="children">test</span>
      </CompanyRegistrationLayout>
    );
    expect(screen.getByText('test title')).toBeInTheDocument();
    expect(screen.getByText('test stepText')).toBeInTheDocument();
    expect(screen.getByText('test subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });
});
