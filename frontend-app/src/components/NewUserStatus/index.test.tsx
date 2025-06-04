import React from 'react';
import { render, screen } from '@testing-library/react';
import NewUserStatus from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('NewUserStatus component', () => {
  test('Should contain header', async () => {
    render(<NewUserStatus waitForProvisioning={false} provisioningStatus="" createNewTenantRedirect={() => {}} />);
    expect(screen.getByText('Thank you! Your user account has been successfully created.')).toBeInTheDocument();
  });

  test('Should contain provisioning text', async () => {
    render(<NewUserStatus waitForProvisioning={false} provisioningStatus="" createNewTenantRedirect={() => {}} />);
    expect(
      screen.getByText('It can take up to one business day for your account access to be enabled.')
    ).toBeInTheDocument();
  });

  test('Should contain provisioning contact information', async () => {
    render(<NewUserStatus waitForProvisioning={false} provisioningStatus="" createNewTenantRedirect={() => {}} />);
    expect(screen.getByText('Please contact', { exact: false })).toBeInTheDocument();
    const mailLink = screen.getByTestId('mail-link');
    expect(mailLink).toBeInTheDocument();
    const email = 'support@getstimulus.io';
    expect(mailLink.getAttribute('href')).toEqual(`mailto:${email}`);
    expect(screen.getByText(email)).toBeInTheDocument();
    expect(screen.getByText('in case of any questions', { exact: false })).toBeInTheDocument();
  });
});
