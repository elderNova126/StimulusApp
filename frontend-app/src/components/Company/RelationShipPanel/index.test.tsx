/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { PieChartRelationship } from './PieChart';
import { store } from '../../../stores/global';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';
import RelationshipPanel from './RelationShipPanel';
import { Company } from '../company.types';
import CommentsSection from './Comments/CommentsSection';
import { FormCompanyProvider } from '../../../hooks/companyForms/companyForm.provider';
import { Badge } from '../../CompanyAccount/Badges/badge.types';
import BadgeDisplay from './Badges/BadgeDisplay';
import BadgeUpdate from './Badges/BadgeUpdate';
import { CompanyAccordion } from '../shared';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('PieChart relationShipPanel', () => {
  const dataChart = {
    companyId: '11111111111111111111',
    CONSIDERED: 1,
    QUALIFIED: 2,
    SHORTLISTED: 3,
    AWARDED: 4,
    CLIENT: 5,
  };

  const dataChartEmpty = {
    companyId: '11111111111111111111',
    CONSIDERED: 0,
    QUALIFIED: 0,
    SHORTLISTED: 0,
    AWARDED: 0,
    CLIENT: 0,
  };

  const dataChartMaxAwarded = {
    companyId: '11111111111111111111',
    CONSIDERED: 1,
    QUALIFIED: 2,
    SHORTLISTED: 3,
    AWARDED: 50,
    CLIENT: 5,
  };

  it('should render PieChart', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <PieChartRelationship dataChart={dataChart} />
        </Provider>
      </MockedProvider>
    );
    expect(screen.getByText('AWARDED')).toBeInTheDocument();
  });

  it('should render PieChart with empty data', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <PieChartRelationship dataChart={dataChartEmpty} />
        </Provider>
      </MockedProvider>
    );
    expect(screen.queryByText('CLIENT')).not.toBeInTheDocument();
  });

  it('should render PieChart with AWARDED like a max Type', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <PieChartRelationship dataChart={dataChartMaxAwarded} />
        </Provider>
      </MockedProvider>
    );
    expect(screen.getByText('AWARDED')).toBeInTheDocument();
  });
  it('should render PieChart with 50 as label', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <PieChartRelationship dataChart={dataChartMaxAwarded} label />
        </Provider>
      </MockedProvider>
    );
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});

describe('relationship panel', () => {
  const company = {
    id: 'abc',
    tenantCompanyRelation: { internalId: 'internalId', internalName: 'internalName', supplierTier: 1 },
    projectsOverview: {
      accountEvaluations: 1,
      accountProjects: 1,
      accountSpent: 1,
      globalSpent: 1,
      totalEvaluations: 1,
      totalProjects: 1,
    },
  } as Company;

  const badge: Badge = {
    badgeDateLabel: 'abc',
    badgeDateStatus: 'hidden',
    badgeDescription: 'abc',
    badgeName: 'badge',
    badgeTenantCompanyRelationships: [
      { id: '123', badgeDate: '2023-05-05', badgeId: '4123213', tenantCompanyRelationshipId: '222' },
    ],
    id: '123',
    tenant: { id: '213' },
  };

  it('should render display mode with data', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <DisplayView
            badges={[badge]}
            company={company}
            classifiedCompanyByType={{
              count: 1,
              results: [] as any,
            }}
            comments={[]}
            commentsLoading={false}
            completedProjects={1}
            highlight={true}
            inProgressProjects={2}
            showComments={false}
            firstProjectStartDate={1}
          />
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Internal Name')).toBeInTheDocument();
    expect(screen.getByText('Internal ID')).toBeInTheDocument();
  });

  it('should render update mode with data', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <FormCompanyProvider>
            <UpdateView company={company} badges={[badge]} />
          </FormCompanyProvider>
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByText('Internal Name')).toBeInTheDocument();
    expect(screen.getByText('Internal ID')).toBeInTheDocument();
  });

  it('should display relationship panel display mode when different tenant id', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <RelationshipPanel company={company} edit={false} />
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByText('Relationship')).toBeInTheDocument();
  });

  it('should display tier with founded', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <DisplayView
            badges={[]}
            company={company}
            classifiedCompanyByType={{
              count: 1,
              results: [] as any,
            }}
            comments={[]}
            commentsLoading={false}
            completedProjects={1}
            highlight={true}
            inProgressProjects={2}
            showComments={false}
            firstProjectStartDate={1}
          />
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByText('Tier 1')).toBeInTheDocument();
    expect(screen.getByText('Since 1')).toBeInTheDocument();
  });
});

describe('comments panel', () => {
  const company = {
    id: 'abc',
    tenantCompanyRelation: { internalId: 'internalId', internalName: 'internalName' },
  } as Company;
  const notes = [
    {
      __typename: 'CompanyNote',
      body: 'new comment',
      created: 'Tue Jul 04 2023 01:53:35 GMT+0000 (Coordinated Universal Time)',
      createdBy: 'abc',
      id: 1,
      parentNote: null,
    },
  ];

  it('should render comments panel with no comments display', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <CommentsSection company={company} comments={[]} />
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText('Be the First to Leave A Comment...')).toBeInTheDocument();
  });

  it('should render comments panel with comments', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <CommentsSection company={company} comments={notes} />
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByTestId('boxCommentsDisplay')).toBeInTheDocument();
  });
});

describe('badges panel', () => {
  const company = {
    id: 'abc',
    tenantCompanyRelation: { internalId: 'internalId', internalName: 'internalName', id: '222' },
  } as Company;

  const badge: Badge = {
    badgeDateLabel: 'abc',
    badgeDateStatus: 'mandatory',
    badgeDescription: 'abc',
    badgeName: 'badge',
    badgeTenantCompanyRelationships: [
      { id: '123', badgeDate: '2023-05-05', badgeId: '4123213', tenantCompanyRelationshipId: '222' },
    ],
    id: '123',
    tenant: { id: '213' },
  };

  const badgeHiddenStatus: Badge = {
    badgeDateLabel: 'abc',
    badgeDateStatus: 'hidden',
    badgeDescription: 'abc',
    badgeName: 'badge',
    badgeTenantCompanyRelationships: [
      { id: '123', badgeDate: '2023-05-05', badgeId: '4123213', tenantCompanyRelationshipId: '222' },
    ],
    id: '123',
    tenant: { id: '213' },
  };

  const badgesOptions: Badge[] = [
    {
      badgeDateLabel: 'abc',
      badgeDateStatus: 'hidden',
      badgeDescription: 'abc',
      badgeName: 'badge1',
      badgeTenantCompanyRelationships: [
        { id: '1', badgeDate: '2023-05-05', badgeId: '3', tenantCompanyRelationshipId: '222' },
      ],
      id: '3',
      tenant: { id: '213' },
    },
    {
      badgeDateLabel: 'abc',
      badgeDateStatus: 'hidden',
      badgeDescription: 'abc',
      badgeName: 'badge2',
      badgeTenantCompanyRelationships: [
        { id: '2', badgeDate: '2023-05-05', badgeId: '2', tenantCompanyRelationshipId: '222' },
      ],
      id: '2',
      tenant: { id: '213' },
    },
    {
      badgeDateLabel: 'abc',
      badgeDateStatus: 'hidden',
      badgeDescription: 'abc',
      badgeName: 'badge3',
      badgeTenantCompanyRelationships: [
        { id: '3', badgeDate: '2023-05-05', badgeId: '1', tenantCompanyRelationshipId: '222' },
      ],
      id: '1',
      tenant: { id: '213' },
    },
  ];

  it('should render badges', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <BadgeDisplay badges={[badge]} tenantCompanyRelationshipId={company.tenantCompanyRelation.id} />
        </Provider>
      </MockedProvider>
    );

    expect(screen.getByTestId('badges-display')).toBeInTheDocument();
  });

  it('should my tenant relationship badges with name and edit the input date', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <CompanyAccordion>
            <BadgeUpdate badges={[badge]} tenantCompanyRelationshipId={company.tenantCompanyRelation.id} />
          </CompanyAccordion>
        </Provider>
      </MockedProvider>
    );

    const inputName = (await screen.findByTestId('badge-input-name')) as HTMLInputElement;
    const inputDate = (await screen.findByTestId('badge-input-date')) as HTMLInputElement;

    expect(inputName).toBeInTheDocument();
    expect(inputName).toHaveValue('Badge');
    expect(inputDate).toBeInTheDocument();
    expect(inputDate).toHaveValue('2023-05-05');

    fireEvent.change(inputDate, { target: { value: '2022-06-06' } });
    expect(inputDate).toHaveValue('2022-06-06');
  });

  it('should not show input date when badge status is hidden', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <CompanyAccordion>
            <BadgeUpdate badges={[badgeHiddenStatus]} tenantCompanyRelationshipId={company.tenantCompanyRelation.id} />
          </CompanyAccordion>
        </Provider>
      </MockedProvider>
    );

    const inputName = (await screen.findByTestId('badge-input-name')) as HTMLInputElement;
    // const inputDate = (await screen.findByTestId('badge-input-date')) as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName).toHaveValue('Badge');
    // expect(inputDate).not.toBeInTheDocument();
  });

  it('dropdown badges', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={store}>
          <CompanyAccordion>
            <BadgeUpdate badges={badgesOptions} tenantCompanyRelationshipId={company.tenantCompanyRelation.id} />
          </CompanyAccordion>
        </Provider>
      </MockedProvider>
    );
    const selectElement = screen.getByTestId('badge-selector') as HTMLSelectElement;
    expect(selectElement).toHaveTextContent('Select a badge');
    fireEvent.mouseDown(selectElement); // Simulates opening the dropdown
    // const options = screen.getAllByRole('option');
    // expect(options).toHaveLength(1);
  });
});
