import { render } from '@testing-library/react';
import UnusedCompanyList from './UnusedCompaniesReport/UnusedCompaniesList';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import { LocationProvider } from '@reach/router';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Unused Companies component', () => {
  test('Should render component', () => {
    render(
      <LocationProvider>
        <Provider store={store}>
          <MockedProvider children={<UnusedCompanyList setPageUnused={() => null} viewId="internal" />} />
        </Provider>
      </LocationProvider>
    );
  });
});
