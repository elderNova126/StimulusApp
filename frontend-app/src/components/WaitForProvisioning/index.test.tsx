import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WaitForProvisioning from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockedProps = {
  provisioningStatus: 'queued',
  createNewTenantRedirect: jest.fn(),
};

describe('WaitForProvisioning component', () => {
  test('Should render status from props', async () => {
    render(<WaitForProvisioning {...mockedProps} />);

    expect(screen.getByText(mockedProps.provisioningStatus)).toBeInTheDocument();
  });

  test('Should call redirect function on button click', async () => {
    render(<WaitForProvisioning {...mockedProps} />);
    expect(mockedProps.createNewTenantRedirect).toBeCalledTimes(0);

    userEvent.click(screen.getByTestId('new-tenant-button'));

    expect(mockedProps.createNewTenantRedirect).toBeCalledTimes(1);
  });
});
