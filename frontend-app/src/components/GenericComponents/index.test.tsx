import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertDialogCustom from '../GenericComponents/AlertDialogComponent';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('AlertDialogCustom component', () => {
  test('Should render without any criteria', () => {
    render(
      <AlertDialogCustom
        textDialogo="test"
        toNext={() => {}}
        toClose={() => {}}
        cancelRef={{ current: undefined }}
        openAndClose={true}
      />
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('Should render with default text', () => {
    render(
      <AlertDialogCustom toNext={() => {}} toClose={() => {}} cancelRef={{ current: undefined }} openAndClose={true} />
    );
    expect(screen.getByText('Are you sure you want to Remove this company from your list?')).toBeInTheDocument();
  });

  test('Render and test buttons', () => {
    render(
      <AlertDialogCustom toNext={() => {}} toClose={() => {}} cancelRef={{ current: undefined }} openAndClose={true} />
    );
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
  });

  test('Render test toClose', async () => {
    const toClose = jest.fn();
    render(
      <AlertDialogCustom toNext={() => {}} toClose={toClose} cancelRef={{ current: undefined }} openAndClose={true} />
    );

    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(toClose).toHaveBeenCalledTimes(0);

    await userEvent.click(screen.getByText('cancel'));
    expect(toClose).toHaveBeenCalledTimes(1);
  });

  test('Render test toNext', async () => {
    const toNext = jest.fn();
    render(
      <AlertDialogCustom toNext={toNext} toClose={() => {}} cancelRef={{ current: undefined }} openAndClose={true} />
    );

    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(toNext).toHaveBeenCalledTimes(0);

    await userEvent.click(screen.getByText('Accept'));
    expect(toNext).toHaveBeenCalledTimes(1);
  });
});
