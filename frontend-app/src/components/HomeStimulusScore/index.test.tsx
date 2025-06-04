import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen } from '@testing-library/react';
import moment from 'moment';
import HomeStimulusScore from '.';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';

const { COMPANY_SCORES_SEARCH_GQL } = CompanyQueries;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Add ResizeObserver mock before tests
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

const mocks: any = [
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
          results: [
            {
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

describe('HomeStimulusScore Component', () => {
  test('Should contains no data alert', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomeStimulusScore tenantCompany={null} />
      </MockedProvider>
    );

    const noDataAlert = screen.getByText('First you need to upload information about your company');
    expect(noDataAlert).toBeInTheDocument();

    const chart = screen.queryByTestId('linechart');
    expect(chart).not.toBeInTheDocument();
  });

  test('Should contains data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomeStimulusScore tenantCompany={{ id: '1', legalBusinessName: 'test' }} />
      </MockedProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    const noDataAlert = screen.queryByText('Last 6 Month Performance');
    expect(noDataAlert).toBeInTheDocument();

    const chart = screen.queryByTestId('linechart');
    expect(chart).toBeInTheDocument();
  });
});
