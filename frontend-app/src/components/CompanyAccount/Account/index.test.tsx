import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AccountPlanInfo from './AccountPlanInfo';
import UserQueries from '../../../graphql/Queries/UserQueries';

const { ACCOUNT_INFO, USER_ACCOUNT } = UserQueries;

describe('AccountPlanInfo - Loading State', () => {
  it('should display the loading screen when data is being fetched', () => {
    const mocks = [
      {
        request: { query: ACCOUNT_INFO },
        result: {},
        delay: 1000,
      },
      {
        request: { query: USER_ACCOUNT },
        result: {},
        delay: 1000,
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AccountPlanInfo />
      </MockedProvider>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });
});
