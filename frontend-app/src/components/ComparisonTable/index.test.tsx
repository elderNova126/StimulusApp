import { render, screen } from '@testing-library/react';
import ComparisonTable from './index';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

describe('ComparisonTable', () => {
  i18n.use(initReactI18next).init({
    resources: {
      en: {},
    },
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

  const companieData = {
    accountProjects: 4,
    accountSpent: 12313,
    brand: 1000,
    brandValue: null,
    cost: 1000,
    customerValue: null,
    customers: null,
    customersGrowthCAGR: null,
    diverseOwnership: [],
    diversity: 1000,
    doingBusinessAs: '(mt) Media Temple',
    employeeValue: null,
    employeesTotal: null,
    features: 1000,
    financial: 1000,
    flexibility: 1000,
    globalSpent: 13757,
    id: '3C1BF5F1-6B29-ED11-AE83-A04A5E8158B2',
    innovation: 1000,
    legalBusinessName: 'Media Temple, Inc. test',
    longevityValue: null,
    netProfit: null,
    netProfitGrowthCAGR: null,
    projectsOverview: {
      quality: 1000,
      relationship: 1000,
      reliability: 1000,
      revenue: null,
      revenueGrowthCAGR: null,
      scoreValue: 1000,
    },
    stimulusScore: {
      results: [
        {
          brand: 1000,
          brandValue: null,
          cost: 1000,
          customerValue: null,
          diversity: 1000,
          employeeValue: null,
          features: 1000,
          financial: 1000,
          flexibility: 1000,
          innovation: 1000,
          longevityValue: null,
          quality: 1000,
          relationship: 1000,
          reliability: 1000,
          scoreValue: 1000,
        },
      ],
    },
    tenantCompanyRelation: {
      id: 'C2A44B39-0744-ED11-819A-0022481E0788',
      isFavorite: true,
      isToCompare: false,
      status: 'active',
      type: 'internal',
    },
    totalAssets: null,
    totalProjects: 11,
  };

  const companies = [
    {
      ...companieData,
      id: '1',
      doingBusinessAs: 'Company A',
      legalBusinessName: 'Company A',
      scoreValue: 5,
      cost: 100,
    },
    {
      ...companieData,
      id: '2',
      doingBusinessAs: 'Company B',
      legalBusinessName: 'Company B',
      scoreValue: 3,
      cost: 200,
    },
  ];

  const EmptyData = {
    companies: [],
    loading: false,
  };

  test('renders ComparisonTable component', () => {
    const view = render(
      <Provider store={store}>
        <MockedProvider children={<ComparisonTable transposeTable={true} data={EmptyData} />} />
      </Provider>
    );
    expect(view).toBeTruthy();
  });

  test('displays data correctly', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<ComparisonTable transposeTable={false} data={{ companies, loading: false }} />} />
      </Provider>
    );

    const TextsWithName = screen.getAllByText(/Company A/i);
    const TextsWithName2 = screen.getAllByText(/Company B/i);
    const TextsWithScore = screen.getAllByText(/Score Value/i);
    const TextsWithCost = screen.getAllByText(/Cost/i);

    expect(TextsWithName.length).toBe(2);
    expect(TextsWithName2.length).toBe(2);
    expect(TextsWithScore.length).toBe(2);
    expect(TextsWithCost.length).toBe(2);
  });

  test('allows user interaction', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<ComparisonTable transposeTable={false} data={{ companies, loading: false }} />} />
      </Provider>
    );
    const checkbox = screen.getByTestId('checkbox-1') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
  });
});
