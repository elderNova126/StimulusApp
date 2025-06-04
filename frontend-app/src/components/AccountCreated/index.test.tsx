import { render, screen } from '@testing-library/react';
import AccountCreated from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('AccountCreated component', () => {
  test('Should contain logo image', async () => {
    render(<AccountCreated />);
    expect(screen.getByAltText('STIMULUS')).toBeInTheDocument();
  });

  test('Should contain account created title', async () => {
    render(<AccountCreated />);
    expect(screen.getByText('ACCOUNT CREATED!')).toBeInTheDocument();
  });

  test('Should contain account created message', async () => {
    render(<AccountCreated />);
    expect(
      screen.getByText(
        'Congratulations! Your account has been successfully created. Do you have a company you want to create or join?'
      )
    ).toBeInTheDocument();
  });

  test('Should contain create company button', async () => {
    render(<AccountCreated />);
    expect(screen.getByText('CREATE COMPANY')).toBeInTheDocument();
  });

  test('Should contain finish registration button', async () => {
    render(<AccountCreated />);
    expect(screen.getByText('FINISH REGISTRATION')).toBeInTheDocument();
  });
});
