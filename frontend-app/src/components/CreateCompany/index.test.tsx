import React from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';
import CreateCompany from '.';
import 'mutationobserver-shim';
import userEvent from '@testing-library/user-event';
global.MutationObserver = window.MutationObserver;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('CreateCompany component', () => {
  let ein = '';
  let companyName = '';
  let duns = 0;
  let einHook: any;
  let companyNameHook: any;
  let dunsHook: any;
  let next = jest.fn();
  beforeEach(() => {
    einHook = [
      ein,
      jest.fn((val: string) => {
        ein = val;
      }),
    ];
    companyNameHook = [
      companyName,
      jest.fn((val: string) => {
        companyName = val;
      }),
    ];
    dunsHook = [
      duns,
      jest.fn((val: number) => {
        duns = val;
      }),
    ];
    next = jest.fn();
  });

  afterEach(() => {
    ein = '';
    companyName = '';
    duns = 0;
  });

  test('Should render default form values', async () => {
    render(<CreateCompany einHook={einHook} companyNameHook={companyNameHook} dunsHook={dunsHook} next={next} />);

    expect(screen.getByTestId('company-name-field').getAttribute('value')).toBe(companyName);
    expect(screen.getByTestId('ein-field').getAttribute('value')).toBe(ein);
    expect(screen.getByTestId('duns-field').getAttribute('value')).toBe(duns || '');
  });

  test('Should change form values', async () => {
    render(<CreateCompany einHook={einHook} companyNameHook={companyNameHook} dunsHook={dunsHook} next={next} />);

    expect(companyNameHook[1]).toBeCalledTimes(0);
    expect(einHook[1]).toBeCalledTimes(0);
    expect(dunsHook[1]).toBeCalledTimes(0);

    fireEvent.change(screen.getByTestId('company-name-field'), { target: { value: 'Changed' } });
    fireEvent.change(screen.getByTestId('ein-field'), { target: { value: 'Changed' } });
    fireEvent.change(screen.getByTestId('duns-field'), { target: { value: '123' } });

    expect(companyName).toBe('Changed');
    expect(ein).toBe('Changed');
    expect(duns).toBe(123);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });
    expect(companyNameHook[1]).toBeCalledTimes(1);
    expect(einHook[1]).toBeCalledTimes(1);
    expect(dunsHook[1]).toBeCalledTimes(1);
  });

  test('Should render errors', async () => {
    render(<CreateCompany einHook={einHook} companyNameHook={companyNameHook} dunsHook={dunsHook} next={next} />);

    userEvent.click(screen.getByTestId('submit-button'));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    expect(next).toBeCalledTimes(0);

    expect(screen.getByTestId('company-name-field-error')).toBeInTheDocument();
    expect(screen.getByTestId('ein-field-error')).toBeInTheDocument();
    expect(screen.getByTestId('duns-field-error')).toBeInTheDocument();
  });

  test('Should call next', async () => {
    einHook = [
      'ein-11',
      jest.fn((val: string) => {
        ein = val;
      }),
    ];
    companyNameHook = [
      'companyName-test',
      jest.fn((val: string) => {
        companyName = val;
      }),
    ];
    dunsHook = [
      123455,
      jest.fn((val: number) => {
        duns = val;
      }),
    ];

    render(<CreateCompany einHook={einHook} companyNameHook={companyNameHook} dunsHook={dunsHook} next={next} />);

    fireEvent.click(screen.getByTestId('submit-button'));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    expect(next).toBeCalledTimes(1);
  });
});
