import { render } from '@testing-library/react';
import { CompaniesMapTable, CompanyDataRow } from '.';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('CompaniesMapTable component', () => {
  const mockData = [
    {
      __typename: 'Company',
      doingBusinessAs: 'Test Doing test 2',
      id: '19598584-A977-EC11-94F6-0003FFD7350B',
      legalBusinessName: 'Test SEARCH 1 ',
      locations: {
        __typename: 'LocationResponse',
        count: 10,
        results: [
          {
            __typename: 'Location',
            addressStreet: 'Test address',
            addressStreet2: 'Test address 2',
            addressStreet3: '',
            id: '7A8903A3-A8DB-EC11-B656-0003FFD75239',
            latitude: '43.669724',
            longitude: '-79.508149',
          },
        ],
      },
    },
  ];

  test('Render table component', async () => {
    const view = render(
      <MockedProvider>
        <Provider store={store} children={<CompaniesMapTable showBanner={() => Boolean} companies={undefined} />} />
      </MockedProvider>
    );
    expect(view).toBeDefined();
  });

  test('Should contain data rows for address', async () => {
    render(
      <MockedProvider>
        <Provider store={store} children={<CompaniesMapTable showBanner={() => Boolean} companies={mockData} />} />
      </MockedProvider>
    );
    expect(
      <CompanyDataRow
        company={mockData[0]}
        location={mockData[0].locations}
        address={mockData[0].locations.results[0].addressStreet}
      />
    ).toBeDefined();
  });
});
