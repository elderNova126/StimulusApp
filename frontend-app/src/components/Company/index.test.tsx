import { render } from '@testing-library/react';
import CustomersPanel from './CustomersPanel/CustomersPanel';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Customers panel Component', () => {
  const company = {
    customers: 1,
    linkedInFollowers: 5,
    facebookFollowers: 6,
    twitterFollowers: 8,
    netPromoterScore: 0.7,
  };

  test('Should render component when there is data for panel', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<CustomersPanel company={company as any} edit={false} />} />
      </Provider>
    );
  });
});
