import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen } from '@testing-library/react';
import HomeCompaniesTable from '.';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { HOME_COMPANIES_GQL } = CompanyQueries;
const mocks = [
  {
    request: {
      query: HOME_COMPANIES_GQL(),
    },
    result: {
      data: {
        discoverCompanies: {
          __typename: 'CompaniesResponse',
          results: [
            {
              id: 1,
              legalBusinessName: 'company test',
              doingBusinessAs: 'company test',
              stimulusScore: {
                results: {
                  id: 1,
                  scoreValue: 222,
                },
                count: 1,
              },
            },
          ],
          count: 1,
        },
      },
    },
  },
];

describe('HomeCompaniesTable component', () => {
  test('Should loading first', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomeCompaniesTable />
      </MockedProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('Should contains default no companies text', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomeCompaniesTable />
      </MockedProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    const noCompaniesText = screen.getByText(
      'Currently, there are no companies added to favorites. To add a favorite company, please click the Companies/Discovery page and the select the “star” icon next to the company.'
    );
    expect(noCompaniesText).toBeInTheDocument();
  });
});
