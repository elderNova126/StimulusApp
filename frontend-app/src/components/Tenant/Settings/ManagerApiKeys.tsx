import { DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { FC, useState } from 'react';
import { ApiKey, ApiKeyStatusOptions } from '../../../graphql/Models/ApiKey';
import { ChangeStatusApiKeyHook, ManagerTenantKeysHook, RemoveApiKeyHook } from '../../../hooks/tenant';
import useToggle from '../../../hooks/utils';
import { formatStringDate } from '../../../utils/date';
import AlertConfirm from '../../AlertConfirm/AlertConfirm';
import NewApiKeyModal from './NewApiKeyModal';
import useStyles from './styles';
import StimButton from '../../ReusableComponents/Button';
const ManagerApiKeys: FC<RouteComponentProps> = (props) => {
  const classes = useStyles();
  const { results: apiKeys } = ManagerTenantKeysHook();
  const [newApiKey, setNewApiKey] = useToggle(false);
  const [search, setSearch] = useState('');

  const containsShearch = (apikey: ApiKey) => {
    if (
      apikey.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      apikey.apiKey.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  const [isSmallerThan1500] = useMediaQuery('(min-width: 1500px)');

  return (
    <Box className={isSmallerThan1500 ? classes.containerSmall : classes.container}>
      <Flex justifyContent={'space-between'}>
        <Text fontSize="4xl">API keys</Text>
        <StimButton onClick={setNewApiKey}>Create API key</StimButton>
        <NewApiKeyModal isOpen={newApiKey} onClose={setNewApiKey} />
      </Flex>
      <InputGroup my="5" w="72">
        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
        <Input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search" />
      </InputGroup>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>ApiKey</Th>
              <Th>Created</Th>
              <Th>Status</Th>
              <Th />
            </Tr>
          </Thead>
          {apiKeys.length > 0 && (
            <Tbody>
              {apiKeys.map((apikey: ApiKey) => {
                if (containsShearch(apikey)) return <RenderApiKeysItem apikey={apikey} search={search} />;
                return null;
              })}
            </Tbody>
          )}
        </Table>
        {apiKeys.length === 0 && (
          <Flex className={classes.emptyResult}>No API key is available. Create a new one to start using it</Flex>
        )}
      </TableContainer>
    </Box>
  );
};

interface ItemProps {
  apikey: ApiKey;
  search: string;
}

type Actions = 'CHANGE_STATUS' | 'REMOVE';

const RenderApiKeysItem = (props: ItemProps) => {
  const { apikey } = props;
  const [confirmChange, setConfirmChange] = useState(false);
  const [action, setAction] = useState<Actions>('REMOVE');
  const classes = useStyles();

  const { changeStatus, loading: loadingCreate } = ChangeStatusApiKeyHook();
  const { deleteApiKey } = RemoveApiKeyHook();

  const onChangeStatusConfirm = () => {
    const newStatus =
      apikey.status === ApiKeyStatusOptions.ACTIVE ? ApiKeyStatusOptions.INACTIVE : ApiKeyStatusOptions.ACTIVE;
    changeStatus({
      id: apikey.id,
      status: newStatus,
    }).then(() => {
      setConfirmChange(false);
    });
  };
  const onRemoveConfirm = () => {
    deleteApiKey({
      id: apikey.id,
    }).then(() => {
      setConfirmChange(false);
    });
  };

  const onChangeStatus = () => {
    setAction('CHANGE_STATUS');
    setConfirmChange(!confirmChange);
  };
  const onRemove = () => {
    setAction('REMOVE');
    setConfirmChange(!confirmChange);
  };

  const confirmAction = () => {
    switch (action) {
      case 'REMOVE':
        onRemoveConfirm();
        break;
      case 'CHANGE_STATUS':
        onChangeStatusConfirm();
        break;

      default:
        break;
    }
  };

  return (
    <Tr key={apikey.id}>
      <Th>{apikey.name}</Th>
      <Th className={classes.apiKeyField}>{apikey.apiKey}</Th>
      <Th>{formatStringDate(apikey.created, 'MM/DD/YYYY')}</Th>
      <Th>
        <Switch size="lg" isChecked={apikey.status === 'ACTIVE' ? true : false} onChange={onChangeStatus} />
      </Th>
      <Th>
        <StimButton onClick={onRemove} variant="stimDestructive" icon={<DeleteIcon />}></StimButton>
      </Th>
      <AlertConfirm
        isVisible={confirmChange}
        onClose={() => setConfirmChange(!confirmChange)}
        onDone={() => confirmAction()}
        message={`Are you sure you want ${
          action === 'REMOVE' ? 'remove' : 'modify'
        } the apikey ${apikey.name.toUpperCase()}?`}
        title={'Confirm'}
        loading={loadingCreate}
      />
    </Tr>
  );
};

export { ManagerApiKeys, RenderApiKeysItem };
