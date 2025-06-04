import { ApiKey } from '../../../graphql/Models/ApiKey';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { RenderApiKeysItem } from './ManagerApiKeys';
import { StylesProvider, Table, Tbody } from '@chakra-ui/react';

interface ItemProps {
  apikey: ApiKey;
  search: string;
}
const mockDispatch = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

describe('Manager Api key Component', () => {
  test('Show render items', async () => {
    const params: ItemProps = {
      apikey: {
        apiKey: 'asd',
        created: '',
        id: '1',
        name: 'name',
        status: 'ACTIVE',
        tenantId: 'asd',
      },
      search: 'asd',
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <StylesProvider value={{}}>
          <Table>
            <Tbody>
              <RenderApiKeysItem {...params} />
            </Tbody>
          </Table>
        </StylesProvider>
      </MockedProvider>
    );

    const nameItem = screen.getByText(params.apikey.name.toString());

    expect(nameItem).toBeInTheDocument();
  });
});
