import { render, screen } from '@testing-library/react';
import ProjectSelectionCriteria from './index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockedSelectionCriteria = ['test', 'test no 2'];

describe('ProjectSelectionCriteria component', () => {
  test('Should render without any criteria', () => {
    render(<ProjectSelectionCriteria project={{ selectionCriteria: [], projectCompany: [] }} />);
    expect(
      screen.getByText('No criteria set for this project. You can add selection criteria by editing this project')
    ).toBeInTheDocument();
  });

  test('Should show criteria list', () => {
    render(<ProjectSelectionCriteria project={{ selectionCriteria: mockedSelectionCriteria, projectCompany: [] }} />);

    mockedSelectionCriteria.forEach((criteria: string) => {
      expect(screen.getByText(criteria)).toBeInTheDocument();
    });
  });
});
