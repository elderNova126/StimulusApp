import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectEvaluationPerformanceMetric from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockedPerformanceMetric = {
  id: 111,
  category: 'someCategory',
  question: 'someQuestion',
  exceptionalValue: 2,
  metExpectationsValue: 2,
  unsatisfactoryValue: 2,
  keyId: 'someKeyId',
};

describe('ProjectEvaluationPerformanceMetric component', () => {
  test('Should contain category', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={3}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    expect(screen.getByText(`${mockedPerformanceMetric.category.toUpperCase()}:`)).toBeInTheDocument();
  });

  test('Should contain question', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={3}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    expect(screen.getByText(`${mockedPerformanceMetric.question}?`)).toBeInTheDocument();
  });
});

describe('PerformanceMetricSlider component', () => {
  test('Should not show any messages for metric', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={-10}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    const metricSlider = screen.getByTestId('metricSlider');
    expect(metricSlider).toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
  });

  test('Should show "Did not meet expectations" message for metric', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={-10}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    const metricSlider = screen.getByTestId('metricSlider');
    expect(metricSlider).toBeInTheDocument();
    userEvent.hover(metricSlider);
    expect(screen.getByText('Did not meet expectations')).toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
    userEvent.unhover(metricSlider);
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
  });

  test('Should show "Met some but not all expectations" message for metric', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={-3}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    const metricSlider = screen.getByTestId('metricSlider');
    expect(metricSlider).toBeInTheDocument();
    userEvent.hover(metricSlider);
    expect(screen.getByText('Met some but not all expectations')).toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
    userEvent.unhover(metricSlider);
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
  });

  test('Should show "Met expectations" message for metric', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={0}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    const metricSlider = screen.getByTestId('metricSlider');
    expect(metricSlider).toBeInTheDocument();
    userEvent.hover(metricSlider);
    expect(screen.getByText('Met expectations')).toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
    userEvent.unhover(metricSlider);
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
  });

  test('Should show "Exceeded some expectations" message for metric', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={5}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    const metricSlider = screen.getByTestId('metricSlider');
    expect(metricSlider).toBeInTheDocument();
    userEvent.hover(metricSlider);
    expect(screen.getByText('Exceeded some expectations')).toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
    userEvent.unhover(metricSlider);
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
  });

  test('Should show "Exceeded all expectations" message for metric', async () => {
    render(
      <ProjectEvaluationPerformanceMetric
        metric={mockedPerformanceMetric}
        metricValue={12}
        onMetricChange={jest.fn()}
        isDisabled={false}
      />
    );
    const metricSlider = screen.getByTestId('metricSlider');
    expect(metricSlider).toBeInTheDocument();
    userEvent.hover(metricSlider);
    expect(screen.getByText('Exceeded all expectations')).toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
    userEvent.unhover(metricSlider);
    expect(screen.queryByText('Exceeded all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Did not meet expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met some but not all expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Met expectations')).not.toBeInTheDocument();
    expect(screen.queryByText('Exceeded some expectations')).not.toBeInTheDocument();
  });
});
