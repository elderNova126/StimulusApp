import { act, render, screen } from '@testing-library/react';
import PickPlan from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
interface PickPlanProps {
  next: () => void;
  prev: () => void;
  planHook: [string, (plan: string) => void];
}
const mockProps: PickPlanProps = {
  next: jest.fn(),
  prev: jest.fn(),
  planHook: ['', jest.fn()],
};

describe('PickPlan component', () => {
  test('Should be defined', async () => {
    const view = render(<PickPlan {...mockProps} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(view).toBeDefined();
    expect(screen.getByTestId('pick-plan-component')).toBeInTheDocument();
  });
});
