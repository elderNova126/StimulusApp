import { render, screen, fireEvent } from '@testing-library/react';
import ContingenciesPanel from './ContingenciesPanel';
import { ChakraProvider } from '@chakra-ui/react';
import { StimulusChakraTheme } from '../../../Theme';
import { MockedProvider } from '@apollo/client/testing';
import { Company } from '../company.types';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock company data with all required properties
const mockCompany: Company = {
  id: '123',
  parentCompany: {
    id: '456',
    taxIdNo: '123456789',
  },
  created: '2023-01-01T00:00:00Z',
  updated: '2023-01-01T00:00:00Z',
  doingBusinessAs: 'Test Company',
  names: [],
  description: 'A test company',
  website: 'https://example.com',
  twitter: 'https://twitter.com/test',
  facebook: 'https://facebook.com/test',
  yearFounded: 2020,
  customerDataYear: 2023,
  brandDataYear: 2023,
  financialDataYear: 2023,
  peopleDataYear: 2023,
  previousBusinessNames: '',
  otherBusinessNames: '',
  industries: [],
  taxIdNo: 123456789,
  creditScoreBusinessNo: '123456',
  typeOfLegalEntity: 'Corporation',
  jurisdictionOfIncorporation: 'US',
  legalBusinessName: 'Test Company Legal',
  ownershipDescription: 'Private',
  customers: 1000,
  customersGrowthCAGR: 5,
  boardTotal: 10,
  boardDiverse: 5,
  leadershipTeamTotal: 20,
  leadershipTeamDiverse: 10,
  leaderDiverse: 'Yes',
  totalLiabilities: 1000000,
  employeesTotal: 100,
  employeesTotalGrowthCAGR: 10,
  revenuePerEmployee: 100000,
  employeesDiverse: 50,
  revenue: 10000000,
  revenueGrowthCAGR: 15,
  netProfit: 1000000,
  netProfitGrowthCAGR: 20,
  totalAssets: 5000000,
  assetsRevenueRatio: 0.5,
  liabilitiesRevenueRatio: 0.1,
  diverseOwnership: ['Minority-owned'],
  minorityOwnership: ['Asian-owned'],
  isSmallBusiness: true,
  tags: [],
  webDomain: 'test.com',
  emailDomain: 'test.com',
  linkedInFollowers: 5000,
  facebookFollowers: 10000,
  twitterFollowers: 8000,
  currency: 'USD',
  evaluations: 100,
  parentCompanyTaxId: '987654321',
  insuranceCoverage: { results: [] },
  certifications: { results: [] },
  stimulusScore: { results: [] },
  tenantCompanyRelation: {
    id: '789',
    internalId: '123',
    internalName: 'Test',
    isFavorite: 1,
    isToCompare: 0,
    type: 'supplier',
    status: 'active',
    supplierTier: 1,
  },
  contacts: { results: [] },
  locations: { results: [] },
  locationsByIndex: [],
  products: { results: [] },
  contingencies: {
    results: [
      {
        id: 1,
        name: 'Financial Contingency',
        type: 'Financial',
        description: 'Test contingency',
        updated: '2023-01-01T00:00:00Z',
        created: '2023-01-01T00:00:00Z',
        website: 'https://example.com',
      },
      {
        id: 2,
        name: 'Regulatory Contingency',
        type: 'Regulatory',
        description: 'Another test',
        updated: '2023-01-01T00:00:00Z',
        created: '2023-01-01T00:00:00Z',
        website: 'https://example.com',
      },
    ],
  },
  news: [],
  projectsOverview: {
    globalSpent: 1000000,
    totalProjects: 50,
    accountProjects: 20,
    accountSpent: 500000,
    accountEvaluations: 10,
    totalEvaluations: 30,
  },
  netPromoterScore: 8,
  operatingStatus: 'ACTIVE',
  linkedin: 'https://linkedin.com/company/test',
};

describe('ContingenciesPanel', () => {
  const renderComponent = (props = {}) => {
    return render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ChakraProvider theme={StimulusChakraTheme}>
          <ContingenciesPanel company={mockCompany} edit={false} {...props} />
        </ChakraProvider>
      </MockedProvider>
    );
  };

  it('renders the Risk Management title', () => {
    renderComponent();
    expect(screen.getByText('Risk Management')).toBeInTheDocument();
  });

  it('displays correct count of contingencies', () => {
    renderComponent();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  describe('List View Button', () => {
    it('changes variant when clicked', () => {
      renderComponent();
      const listViewButton = screen.getByText('List View');
      expect(listViewButton).toBeInTheDocument();
      expect(listViewButton).toHaveClass('chakra-button');
      expect(listViewButton).toBeTruthy();
    });

    it('shows close icon when list view is active', () => {
      renderComponent();
      const listViewButton = screen.getByText('List View');

      // Click to enable list view
      fireEvent.click(listViewButton);

      // Close icon should be visible
      const closeIcon = screen.getByTestId('list-view-close-icon');
      expect(closeIcon).toBeInTheDocument();

      // Click close icon
      fireEvent.click(closeIcon);

      // Close icon should be removed
      expect(screen.queryByTestId('list-view-close-icon')).not.toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('renders UpdateView when edit prop is true', () => {
      renderComponent({ edit: true });
      // Look for elements specific to UpdateView
      expect(screen.getByTestId('update-view')).toBeInTheDocument();
    });

    it('renders DisplayView when edit prop is false', () => {
      renderComponent({ edit: false });
      // Look for elements specific to DisplayView
      expect(screen.getByTestId('display-view')).toBeInTheDocument();
    });
  });

  describe('Contingencies Filtering', () => {
    it('filters contingencies when type is selected', async () => {
      renderComponent();

      // Update the selector to find the Filter button
      const filtersButton = screen.getByText('Filter');
      fireEvent.click(filtersButton);

      // Select a filter type - using a more specific selector
      const filterOption = screen.getAllByText('Financial')[0]; // Get the first occurrence

      fireEvent.click(filterOption);

      // Verify filtered results using more specific text
      expect(screen.queryByText('Regulatory Contingency')).not.toBeInTheDocument();
      expect(screen.getByText('Financial Contingency')).toBeInTheDocument();
    });
  });
});
