import { render, screen, fireEvent } from '@testing-library/react';

import ProjectEvaluation from './index';
import { ProjectCompanyModel } from './evaluation.interface';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ProjectEvaluation component', () => {
  const mockOnSelect = jest.fn();
  const projectCompany: ProjectCompanyModel = {
    id: 1,
    companyId: '123',
    company: { legalBusinessName: 'Test Company' },
    evaluations: [
      {
        id: 1,
        budgetSpend: 5000,
        submitted: true,
        quality: 1,
        reliability: 1000,
        features: 1000,
        cost: 1000,
        relationship: 1000,
        financial: 1000,
        diversity: 1000,
        innovation: 1000,
        flexibility: 1000,
        brand: 1000,
        created: 'Tue Oct 11 2022 18:29:32 GMT-0400 (Eastern Daylight Time)',
        createdBy: 'test-user-id',
        description: 'description',
      },
    ],
  };

  const projectEvaluationComponent = <ProjectEvaluation projectCompany={projectCompany} onSelect={mockOnSelect} />;

  test('Should render ProjectEvaluation component', () => {
    const view = render(projectEvaluationComponent);
    expect(view).toBeDefined();
  });

  test('Should display the company name', () => {
    render(projectEvaluationComponent);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  test('Should navigate to company profile', () => {
    render(projectEvaluationComponent);
    const companyName = screen.getByTestId('companyName');
    expect(companyName).toBeInTheDocument();
    fireEvent.click(companyName);
    expect(window.location.pathname).toBe(`/company/${projectCompany?.companyId}`);
  });

  test('Should display the budget spend if available', () => {
    render(projectEvaluationComponent);
    expect(screen.getByText('Spend: 5 K')).toBeInTheDocument();
  });

  test('Should render and handle click on the "Start" button', () => {
    render(projectEvaluationComponent);
    const startButton = screen.getByText('Start');
    expect(startButton).toBeInTheDocument();
    fireEvent.click(startButton);
    expect(mockOnSelect).toHaveBeenCalled();
  });
});
