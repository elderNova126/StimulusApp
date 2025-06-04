import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectEvaluationPerformance, { PerformanceState } from './index';
import { MetricModel, ProjectCompanyModel } from '../ProjectEvaluation/evaluation.interface';
import { FormCompanyProvider } from '../../hooks/companyForms/companyForm.provider';

describe('ProjectEvaluationPerformance Component', () => {
  const mockSelectedCompany: ProjectCompanyModel = {
    id: 1,
    companyId: '123',
    company: { legalBusinessName: 'Test Company' },
    evaluations: [
      {
        id: 1,
        budgetSpend: 500,
        description: 'Initial evaluation',
        created: 'Tue Oct 11 2022 18:29:32 GMT-0400 (Eastern Daylight Time)',
        submitted: true,
        quality: 1000,
        reliability: 1000,
        features: 1000,
        cost: 1000,
        relationship: 1000,
        financial: 1000,
        diversity: 1000,
        innovation: 1000,
        flexibility: 1000,
        brand: 1000,
        createdBy: 'test-user-id',
      },
    ],
  };

  const mockSelectedCompanyWithoutEval: ProjectCompanyModel = {
    id: 1,
    companyId: '123',
    company: { legalBusinessName: 'Test Company' },
    evaluations: [],
  };

  const mockMetrics: MetricModel[] = [
    {
      id: 1,
      category: 'Quality',
      question: 'How would you rate the quality of the products and services',
      exceptionalValue: 1,
      metExpectationsValue: 1,
      unsatisfactoryValue: 1,
      keyId: 'quality',
    },
    {
      id: 2,
      category: 'Reliability',
      question: 'How would you rate the reliability of the supplier',
      exceptionalValue: 1,
      metExpectationsValue: 1,
      unsatisfactoryValue: 1,
      keyId: 'reliability',
    },
  ];

  const defaultPerformanceState: PerformanceState = {
    quality: 0,
    reliability: 0,
    features: 0,
    cost: 0,
    relationship: 0,
    financial: 0,
    diversity: 0,
    innovation: 0,
    flexibility: 0,
    brand: 0,
  };

  const mockOnChangeSelectedCompany = jest.fn();
  const mockSaveEvaluation = jest.fn();
  const mockUpdateEvaluation = jest.fn();

  const setupComponent = (props = {}) => {
    render(
      <FormCompanyProvider>
        <ProjectEvaluationPerformance
          selectedCompanyForEvaluation={mockSelectedCompany}
          metrics={mockMetrics}
          onChangeSelectedCompany={mockOnChangeSelectedCompany}
          saveEvaluation={mockSaveEvaluation}
          updateEvaluation={mockUpdateEvaluation}
          defaultProjectEvaluationBudget={500}
          {...props}
        />
      </FormCompanyProvider>
    );
  };
  test('renders component with correct heading and company name', () => {
    setupComponent();
    expect(screen.getByText('Performance Evaluation')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Please rate ${mockSelectedCompany.company.legalBusinessName}'s performance`, 'i'))
    ).toBeInTheDocument();
  });

  test('displays default metrics and allows metric change', () => {
    setupComponent();
    const qualitySlider = screen.getByText('QUALITY:') as HTMLInputElement;
    expect(qualitySlider).toBeInTheDocument();
  });

  test('should not render EvaluationDate without evaluation', () => {
    setupComponent({ selectedCompanyForEvaluation: mockSelectedCompanyWithoutEval });
    expect(screen.queryByText('EVALUATION DATE')).not.toBeInTheDocument();
  });

  test('should render defaultBudgetSpend without evaluation', () => {
    setupComponent({ selectedCompanyForEvaluation: mockSelectedCompanyWithoutEval });
    const budgetSpendInput = screen.getByTestId('project-evaluation-actual-spend') as HTMLInputElement;
    expect(budgetSpendInput.value).toBe('500');
  });

  test('handles budget spend input change correctly', async () => {
    setupComponent();
    const budgetSpendInput = screen.getByTestId('project-evaluation-actual-spend') as HTMLInputElement;
    fireEvent.change(budgetSpendInput, { target: { value: '600' } });
    await waitFor(() => expect(budgetSpendInput.value).toBe('600'));
  });

  test('calls onDescriptionChange function', async () => {
    setupComponent();
    const descriptionInput = screen.getByTestId('project-evaluation-comment') as HTMLInputElement;
    fireEvent.change(descriptionInput, { target: { value: 'test-comment' } });
    await waitFor(() => expect(descriptionInput.value).toBe('test-comment'));
  });

  test('calls saveEvaluation function with correct parameters on save', async () => {
    setupComponent();
    const saveButton = screen.getByTestId('project-evaluation-save');
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockSaveEvaluation).toHaveBeenCalledWith(
        defaultPerformanceState,
        500,
        'Initial evaluation',
        expect.any(Date)
      )
    );
  });

  test('calls onChangeSelectedCompany with null when close button is clicked', () => {
    setupComponent();
    const closeButton = screen.getByTestId('evaluation-cancel-button');
    fireEvent.click(closeButton);
    expect(mockOnChangeSelectedCompany).toHaveBeenCalledWith(null);
  });
});
