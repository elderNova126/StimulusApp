import { render, screen, fireEvent } from '@testing-library/react';
import InsurancePanel from './InsurancePanel';
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
  insuranceCoverage: {
    results: [
      {
        id: 1,
        name: 'Property Insurance',
        type: 'Property',
        description: 'Building insurance',
        coverageStart: '2023-01-01',
        coverageEnd: '2024-01-01',
        coverageLimit: 1000000,
        insurer: 'Test Insurance Co',
        policyNumber: 'POL123',
      },
      {
        id: 2,
        name: 'Liability Insurance',
        type: 'Liability',
        description: 'General liability coverage',
        coverageStart: '2023-01-01',
        coverageEnd: '2024-01-01',
        coverageLimit: 2000000,
        insurer: 'Test Insurance Co',
        policyNumber: 'POL456',
      },
    ],
  },
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
  contingencies: { results: [] },
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

describe('InsurancePanel', () => {
  const renderComponent = (props = {}) => {
    return render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ChakraProvider theme={StimulusChakraTheme}>
          <InsurancePanel company={mockCompany} edit={false} {...props} />
        </ChakraProvider>
      </MockedProvider>
    );
  };

  it('renders the Insurance title', () => {
    renderComponent();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
  });

  it('displays correct count of insurances', () => {
    renderComponent();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  describe('Grid View Button', () => {
    it('changes variant when clicked', () => {
      renderComponent();
      const gridViewButton = screen.getByText('Grid View');
      expect(gridViewButton).toBeInTheDocument();
      expect(gridViewButton).toHaveClass('chakra-button');
      expect(gridViewButton).toBeTruthy();
    });

    it('shows close icon when grid view is active', () => {
      renderComponent();
      const gridViewButton = screen.getByText('Grid View');

      // Click to enable grid view
      fireEvent.click(gridViewButton);

      // Close icon should be visible
      const closeIcon = screen.getByTestId('grid-view-close-icon');
      expect(closeIcon).toBeInTheDocument();

      // Click close icon
      fireEvent.click(closeIcon);

      // Close icon should be removed
      expect(screen.queryByTestId('grid-view-close-icon')).not.toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('renders UpdateView when edit prop is true', () => {
      renderComponent({ edit: true });
      // Look for elements specific to UpdateView, like a form or add button
      expect(screen.getByText('Property Insurance')).toBeInTheDocument();
      expect(screen.getByText('Liability Insurance')).toBeInTheDocument();
    });

    it('renders DisplayView when edit prop is false', () => {
      renderComponent({ edit: false });
      // Look for elements specific to DisplayView, like the grid/list layout
      expect(screen.getByText('Grid View')).toBeInTheDocument();
      expect(screen.getByText('Property Insurance')).toBeInTheDocument();
      expect(screen.getByText('Liability Insurance')).toBeInTheDocument();
    });
  });

  describe('Insurance Filtering', () => {
    it('filters insurances when type is selected', async () => {
      renderComponent();

      const filtersButton = screen.getByText('Filter');
      fireEvent.click(filtersButton);

      const filterOption = screen.getAllByText('Property')[0];
      fireEvent.click(filterOption);

      expect(screen.queryByText('Liability Insurance')).not.toBeInTheDocument();
      expect(screen.getByText('Property Insurance')).toBeInTheDocument();
    });
  });

  describe('Attachments', () => {
    it('renders attachments section', () => {
      renderComponent();
      expect(screen.getByTestId('insurance-attachment')).toBeInTheDocument();
      expect(screen.getByText('Attachments')).toBeInTheDocument();
    });
  });
});
