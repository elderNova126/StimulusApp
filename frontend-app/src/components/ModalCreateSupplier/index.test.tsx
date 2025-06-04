import { render, screen, waitFor } from '@testing-library/react';
import ModalCreateSupplier from './ModalCreateSupplier';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import { LocationProvider } from '@reach/router';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Modal create supplier component', () => {
  test('Should render component', async () => {
    render(
      <LocationProvider>
        <Provider store={store}>
          <MockedProvider children={<ModalCreateSupplier />} />
        </Provider>
      </LocationProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Create a Supplier Company')).toBeInTheDocument();
    });
  });
});
