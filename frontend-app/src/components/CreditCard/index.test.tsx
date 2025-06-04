import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CreditCard from '.';
import moment from 'moment';
import 'mutationobserver-shim';
import userEvent from '@testing-library/user-event';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const currentDate = moment();
const mockNext = jest.fn();
const prev = jest.fn();

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: () => jest.fn(),
    handleSubmit: () => mockNext(),
    errors: {},
  }),
}));

describe('CreditCard component', () => {
  const mockSetCardNameHook = jest.fn();
  const mockSetCardNumberHook = jest.fn();
  const mockSetExpirationDateHook = jest.fn();
  const mockSetPostalCodeHook = jest.fn();
  const CreditCardComponent = (
    <CreditCard
      cardNameHook={['someCardNameHook', mockSetCardNameHook]}
      cardNumberHook={['someCardNumberHook', mockSetCardNumberHook]}
      cardExpirationDate={[currentDate, mockSetExpirationDateHook]}
      cardPostalCode={['somePostalCodeHook', mockSetPostalCodeHook]}
      next={mockNext}
      prev={prev}
    />
  );

  test('Should contain back button', async () => {
    render(CreditCardComponent);
    const backButton = screen.getByText('< Back');
    expect(backButton).toBeInTheDocument();
    userEvent.click(backButton);
    expect(prev).toHaveBeenCalled();
  });

  test('Should contain payment options', async () => {
    render(CreditCardComponent);
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    const paymentOptions = screen.getByTestId('payment-options');
    expect(paymentOptions).toBeInTheDocument();

    const creditCardOption = screen.getByRole('option', { name: 'Credit Card' });
    expect(creditCardOption).toBeInTheDocument();
    expect(creditCardOption).toHaveValue('credit_card');
    expect(creditCardOption).toHaveTextContent('Credit Card');
  });

  test('Should contain name on card', async () => {
    render(CreditCardComponent);
    expect(screen.getByText('Name on Card')).toBeInTheDocument();
    const cardNameField = screen.getByTestId('card-name-field');
    expect(cardNameField).toBeInTheDocument();
    expect(cardNameField).toHaveProperty('value', 'someCardNameHook');
  });

  test('Should contain card number', async () => {
    render(CreditCardComponent);
    expect(screen.getByText('Card Number')).toBeInTheDocument();
    const cardNumberField = screen.getByTestId('card-number-field');
    expect(cardNumberField).toBeInTheDocument();
    expect(cardNumberField).toHaveProperty('value', 'someCardNumberHook');
  });

  test('Should contain expiration date', async () => {
    render(CreditCardComponent);
    expect(screen.getByText('Expiration Date')).toBeInTheDocument();
    const cardExpirationDate = screen.getByTestId('inner-card-expiration-date');
    expect(cardExpirationDate).toBeInTheDocument();
    fireEvent.change(cardExpirationDate, { target: { value: new Date() } });
  });

  test('Should contain postal code', async () => {
    render(CreditCardComponent);
    expect(screen.getByText('Postal Code')).toBeInTheDocument();
    const postalCode = screen.getByTestId('postal-code-field');
    expect(postalCode).toBeInTheDocument();
    expect(postalCode).toHaveProperty('value', 'somePostalCodeHook');
  });

  test('Should contain country options', async () => {
    render(CreditCardComponent);
    expect(screen.getByText('Country')).toBeInTheDocument();
    const countryOptions = screen.getByTestId('country-options');
    expect(countryOptions).toBeInTheDocument();

    const usaOption = screen.getByRole('option', { name: 'USA' });
    expect(usaOption).toBeInTheDocument();
    expect(usaOption).toHaveValue('usa');
    expect(usaOption).toHaveTextContent('USA');
  });

  test('Should contain CREATE COMPANY button', async () => {
    render(CreditCardComponent);
    const createCompanyButton = screen.getByText('CREATE COMPANY');
    expect(createCompanyButton).toBeInTheDocument();
    userEvent.click(createCompanyButton);
    expect(mockNext).toHaveBeenCalled();
  });
});
