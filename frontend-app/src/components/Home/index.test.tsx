import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen } from '@testing-library/react';
import moment from 'moment';
import Home from '.';
import { TenantCompanyContext } from '../../context/TenantCompany';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';

// Add this before the jest.mock statements
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks', () => ({
  useUser: () => ({
    user: {
      sub: '',
      given_name: 'given-name',
      family_name: 'family-name',
      tenantCompanyEin: 'test-ein',
    },
  }),
  useAssetUri: () => [
    { profileImageSrc: 'https://myURL.com' },
    function refetch() {
      return Promise.resolve();
    },
  ],
}));

const { HOME_PROJECTS_GQL } = ProjectQueries;
const { COMPANY_EIN_SEARCH_GQL, HOME_COMPANIES_GQL, COMPANY_SCORES_SEARCH_GQL } = CompanyQueries;
const mocks = [
  {
    request: {
      query: COMPANY_EIN_SEARCH_GQL('test-ein'),
    },
    result: {
      data: {
        searchCompanies: {
          results: [
            {
              id: '1',
              legalBusinessName: 'company test',
              doingBusinessAs: 'test comp',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: HOME_COMPANIES_GQL(),
    },
    result: {
      data: {
        discoverCompanies: {
          results: [
            {
              __typename: 'Company',
              id: '1',
              legalBusinessName: 'company test',
              doingBusinessAs: 'company test',
              stimulusScore: {
                __typename: 'StimulusScoreResponse',
                results: {
                  __typename: 'StimulusScore',
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
  {
    request: {
      query: HOME_PROJECTS_GQL(),
    },
    result: {
      data: {
        searchProjects: {
          __typename: 'ProjectsResponse',
          results: [
            {
              id: 1,
              description: 'test desc',
              status: 'INPROGRESS',
              title: 'Test',
              legalBusinessName: '',
              expectedEndDate: '',
              targetScore: 123,
              startDate: '',
              projectCompany: [
                {
                  id: 1,
                  type: 'AWARDED',
                  company: {
                    id: 1,
                    legalBusinessName: 'Stimulus',
                    doingBusinessAs: 'Stimulus',
                  },
                },
              ],
            },
          ],
          count: 1,
        },
      },
    },
  },
  {
    request: {
      query: COMPANY_SCORES_SEARCH_GQL({
        companies: [{ id: '1', legalBusinessName: 'test' }],
        metric: 'scoreValue',
        period: { from: moment().subtract(6, 'months'), to: moment() },
      }),
    },
    result: {
      data: {
        score_1: {
          __typename: 'StimulusScoreResponse',
          results: [
            {
              __typename: 'StimulusScore',
              id: 1,
              scoreValue: 124,
              timestamp: moment().subtract(6, 'months'),
            },
          ],
          count: 1,
        },
      },
    },
  },
];

describe('Home component', () => {
  test('Should load information from token', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TenantCompanyContext.Provider value={{ loading: false, tenantCompany: {} }}>
          <Home />
        </TenantCompanyContext.Provider>
      </MockedProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('given-name family-name')).toBeInTheDocument();
  });

  test('Should contain 4 panel with data', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TenantCompanyContext.Provider value={{ loading: false, tenantCompany: {} }}>
          <Home />
        </TenantCompanyContext.Provider>
      </MockedProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    expect(screen.getByTestId('stimulus-score')).toBeInTheDocument();
    expect(screen.getByTestId('top-companies')).toBeInTheDocument();
    expect(screen.getByTestId('active-projects')).toBeInTheDocument();
    expect(screen.getByTestId('alerts')).toBeInTheDocument();
  });
});
