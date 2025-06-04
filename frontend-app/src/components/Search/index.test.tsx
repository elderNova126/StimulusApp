import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import Search from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Search component', () => {
  test('Should be defined', async () => {
    const view = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Search />
      </MockedProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    });

    expect(view).toBeDefined();
  });
});
