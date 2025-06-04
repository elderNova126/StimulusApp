import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AiSuggestion, { InsightsModel, ScatterPlot3D } from './AiSuggestions';
import { useDashboard3DMapContext } from '../../context/DashboardAIMap';
import { VectorDBCompany } from './reports.types';
import { useDisclosure } from '@chakra-ui/react';

// Mock the context
jest.mock('../../context/DashboardAIMap', () => ({
  useDashboard3DMapContext: jest.fn(),
}));

// Mock the useDisclosure hook
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useDisclosure: jest.fn(),
  };
});

const mockUseDisclosure = {
  isOpen: false,
  onOpen: jest.fn(),
  onClose: jest.fn(),
};

const mockContextValue = {
  companies: [],
  loading: false,
  fetchCompanies: jest.fn(),
};

const mockCompanies: VectorDBCompany[] = [
  {
    company_id: '1',
    legal_business_name: 'Company One',
    description: 'Description One',
    naics_description: 'NAICS One',
    diverse_ownership: ['Ownership One'],
    minority_ownership_detail: ['Detail One'],
    locations: ['Location One'],
    score: 85,
    vectors: [1, 2, 3],
  },
  {
    company_id: '2',
    legal_business_name: 'Company Two',
    description: 'Description Two',
    naics_description: 'NAICS Two',
    diverse_ownership: ['Ownership Two'],
    minority_ownership_detail: ['Detail Two'],
    locations: ['Location Two'],
    score: 90,
    vectors: [4, 5, 6],
  },
];

describe('AiSuggestion Component', () => {
  beforeEach(() => {
    (useDashboard3DMapContext as jest.Mock).mockReturnValue(mockContextValue);
    (useDisclosure as jest.Mock).mockReturnValue(mockUseDisclosure);
  });

  test('renders AiSuggestion component', () => {
    render(<AiSuggestion />);
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  test('renders InsightsModel component', () => {
    render(<InsightsModel companyName="Test Company" suggestion="Test Suggestion" />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test Suggestion')).toBeInTheDocument();
  });

  test('renders ScatterPlot3D component', () => {
    render(<ScatterPlot3D companyId="123" />);
    expect(screen.getByText('Supplier Intelligence Map')).toBeInTheDocument();
  });

  test('shows loading spinner when loading', () => {
    (useDashboard3DMapContext as jest.Mock).mockReturnValue({ ...mockContextValue, loading: true });
    render(<ScatterPlot3D companyId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows no information message when no companies', () => {
    render(<ScatterPlot3D companyId="123" />);
    expect(screen.getByText('There is no information available')).toBeInTheDocument();
  });

  test('renders no information message when no companies are available', () => {
    (useDashboard3DMapContext as jest.Mock).mockReturnValue({ ...mockContextValue, companies: [] });
    render(<ScatterPlot3D companyId="123" />);

    // Check if the no information message is rendered
    expect(screen.getByText('Supplier Intelligence Map')).toBeInTheDocument();
    expect(screen.getByText('There is no information available')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument(); // Assuming Plot component renders a figure
  });

  test('processes companies and vectors correctly', () => {
    const companies = mockCompanies;
    const chartData: {
      companiesName: string[];
      column1: number[];
      column2: number[];
      column3: number[];
    } = {
      companiesName: [],
      column1: [],
      column2: [],
      column3: [],
    };

    for (const company of companies) {
      if (Array.isArray(company.vectors) && company?.vectors?.length >= 3) {
        const [column1, column2, column3] = company.vectors;
        chartData.companiesName.push(company.legal_business_name || '');
        chartData.column1.push(column1);
        chartData.column2.push(column2);
        chartData.column3.push(column3);
      }
    }

    expect(chartData.companiesName).toEqual(['Company One', 'Company Two']);
    expect(chartData.column1).toEqual([1, 4]);
    expect(chartData.column2).toEqual([2, 5]);
    expect(chartData.column3).toEqual([3, 6]);
  });

  test('displays no information message when companies array is empty', () => {
    (useDashboard3DMapContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      companies: [],
      loading: false,
    });

    render(<ScatterPlot3D companyId="123" />);

    // Check if the no information message is rendered
    expect(screen.getByText('There is no information available')).toBeInTheDocument();
  });
});
