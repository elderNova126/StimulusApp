import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen } from '@testing-library/react';
import HomeAlertsTable from '.';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('HomeAlertsTable Component', () => {
  test('Should contains no alerts text', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomeAlertsTable />
      </MockedProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    const noAlertsText = screen.getByText("You don't have any alerts at this moment!");
    expect(noAlertsText).toBeInTheDocument();
  });
});
