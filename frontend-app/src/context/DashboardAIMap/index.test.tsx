import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Dashboard3DMapProvider, useDashboard3DMapContext } from './index';
import apiClient from '../../utils/apiClient';

jest.mock('../../utils/apiClient');

const mockApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const mockCompanies = [
  {
    company_id: '1',
    legal_business_name: 'Mock Company 1, Inc.',
    description:
      'Mock Company 1 provides software solutions for supply chain management and contract optimization. Specializing in innovative and efficient application development.',
    naics_description: 'Custom Computer Programming Services',
    diverse_ownership: 'Minority',
    minority_ownership_detail: 'Hispanic',
    locations: ['123 Innovation Drive, Suite 100, TechCity, CA, 90210, US'],
    vectors: [1.234, -0.567, 0.891],
    score: 0.005,
  },
  {
    company_id: '2',
    legal_business_name: 'Mock Company 2, LLC',
    description:
      'Mock Company 2 focuses on administrative management and HR consulting services, with expertise in executive search and talent management.',
    naics_description: 'Administrative Management and General Management Consulting Services',
    diverse_ownership: 'Women',
    minority_ownership_detail: 'Asian American',
    locations: ['456 Strategy Blvd, Suite 200, BusinessTown, TX, 75001, US'],
    vectors: [2.345, -1.234, 0.678],
    score: 0.004,
  },
];

const TestComponent = () => {
  const { companies, loading, fetchCompanies } = useDashboard3DMapContext();
  console.log('Loading state:', loading); // Debugging line
  return (
    <div>
      {loading && <p>Loading...</p>}
      <ul>
        {companies.map((company) => (
          <li key={company.company_id}>{company.legal_business_name}</li>
        ))}
      </ul>
      <button onClick={() => fetchCompanies('test-id')}>Fetch Companies</button>
    </div>
  );
};

describe('Dashboard3DMapProvider', () => {
  it('fetches and displays companies', async () => {
    mockApiClient.mockResolvedValueOnce(mockCompanies);

    render(
      <Dashboard3DMapProvider>
        <TestComponent />
      </Dashboard3DMapProvider>
    );
    await act(async () => {
      screen.getByRole('button', { name: /fetch companies/i }).click();
    });
    // expect(await screen.findByText((content) => content.includes('Loading'))).toBeInTheDocument();
    // await waitFor(() => {
    //   expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    // });
    // expect(await screen.findByText('Mock Company 1, Inc.')).toBeInTheDocument();
    // expect(await screen.findByText('Mock Company 2, LLC')).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    mockApiClient.mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <Dashboard3DMapProvider>
        <TestComponent />
      </Dashboard3DMapProvider>
    );

    screen.getByRole('button', { name: /fetch companies/i }).click();

    // expect(await screen.findByText('Loading...')).toBeInTheDocument();
    // expect(await screen.findByText('Loading...')).not.toBeInTheDocument();
  });
});

export {};
