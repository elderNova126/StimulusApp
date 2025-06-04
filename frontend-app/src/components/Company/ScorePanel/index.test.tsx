import { render, screen } from '@testing-library/react';
import ScorePanel from './ScorePanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('score panel tests', () => {
  const company = {
    stimulusScore: {
      results: {
        id: 1,
        scoreValue: 1245,
        brandValue: 452,
        customerValue: 123,
        employeeValue: 1234,
        longevityValue: 1235,
        quality: 1800,
        reliability: 1234,
        features: 765,
        cost: 845,
        relationship: 246,
        financial: 1600,
        diversity: 1349,
        innovation: 1760,
        flexibility: 1534,
        brand: 1010,
      },
    },
  };

  it('show score-panel display mode when edit is false', () => {
    render(<ScorePanel company={company as any} edit={false} />);
    const scorePanelElement = screen.getByTestId('score-panel');

    expect(scorePanelElement).toBeInTheDocument();
  });

  it('hide display mode when edit is true', () => {
    render(<ScorePanel company={company as any} edit={true} />);
    const scorePanelElement = screen.queryByTestId('score-panel');
    expect(scorePanelElement).toBeNull();
  });

  it('show score-panel edit mode when edit is true', () => {
    render(<ScorePanel company={company as any} edit={true} />);
    const scorePanelElement = screen.getByTestId('score-panel-update');

    expect(scorePanelElement).toBeInTheDocument();
  });

  it('hide update mode when edit false', () => {
    render(<ScorePanel company={company as any} edit={false} />);
    const scorePanelElement = screen.queryByTestId('score-panel-update');
    expect(scorePanelElement).toBeNull();
  });
});
