import { useLazyQuery, useQuery } from '@apollo/client';
import { Flex, HStack, Stack, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import ListIcon from '@material-ui/icons/List';
import RoomIcon from '@material-ui/icons/Room';
import SwapHorizSharpIcon from '@material-ui/icons/SwapHorizSharp';
import { RouteComponentProps, navigate } from '@reach/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import 'react-reflex/styles.css';
import { ISharedList, SharedListStatus } from '../../graphql/Models/SharedList';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ListQueries from '../../graphql/Queries/ListQueries';
import UserQueries from '../../graphql/Queries/UserQueries';
import { useUser } from '../../hooks';
import { applyFilters, DiscoveryState, setStatus, setType } from '../../stores/features';
import { setSharedListCollaborators } from '../../stores/features/generalData';
import CompaniesFilters from '../CompaniesFilters';
import CompaniesSearch from '../CompaniesSearch';
import CompaniesSavedSearches from '../CompaniesSearches';
import BannerWithPhoto from '../GenericComponents/BannerWithPhoto';
import CustomTab from '../GenericComponents/CustomTab';
import ListActionMenu from '../ListActionsMenu';
import ModalCreateSupplier from '../ModalCreateSupplier/ModalCreateSupplier';
import Comparison from './Comparison';
import CompanyList from './List';
import CompaniesMap from './Map';
import StimButton from '../ReusableComponents/Button';
const { GET_COLLABORATORS_LIST } = ListQueries;
const { GET_COMPANY_LISTS } = CompanyQueries;
const { GET_USER_BY_ID } = UserQueries;

export const Companies = (
  props: RouteComponentProps & {
    title?: any;
    view: string;
    id?: string;
    page?: string;
    viewMode?: string;
  }
) => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [bannerForFavorite, setBannerForFavorite] = useState(false);
  const [list, setList] = useState<any>(undefined);
  const [titleList, setTitleList] = useState<string>('');
  const dispatch = useDispatch();

  const { view, id, viewMode } = props;
  const listId = props?.view === 'lists/:id/:viewMode/:page' ? id : null;
  const pathName = view?.replace(/\/.*/g, "$'");

  const { data, loading } = useQuery(GET_COMPANY_LISTS, { fetchPolicy: 'cache-and-network' });
  const lists: any = data?.companyLists?.results ?? [];

  const sharedListResult: ISharedList[] = useSelector((state: any) => state.generalData.sharedLists);
  const type: string[] = useSelector((state: { discovery: DiscoveryState }) => state.discovery.type);
  const editable = !!listId;
  const state: any = props.location?.state ?? {};
  const { tenant, listName } = state;

  const [getCreatorUser, { data: userCreator }] = useLazyQuery(GET_USER_BY_ID, {
    variables: { externalAuthSystemId: list?.createdBy },
    fetchPolicy: 'cache-and-network',
  });
  const creator = userCreator?.getUserById;
  const {
    user: { sub },
  } = useUser();
  const isCreatorList = list?.createdBy === sub;

  useEffect(() => {
    if (pathName === 'internal' && type.includes('external')) {
      dispatch(setStatus([]));
      dispatch(setType([]));
      dispatch(applyFilters());
    }
  }, [pathName]); // eslint-disable-line react-hooks/exhaustive-deps

  const [getCollaboratorUsers] = useLazyQuery(GET_COLLABORATORS_LIST, {
    variables: { listId, tenantId: tenant ? tenant.id : null },
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      const filteredCollaborators = data?.GetCollaboratorsList?.results?.filter(
        (collaborator: any) =>
          collaborator.status !== SharedListStatus.DELETED &&
          collaborator.status !== SharedListStatus.DECLINED &&
          collaborator.id !== creator?.id
      );
      dispatch(setSharedListCollaborators(filteredCollaborators ?? []));
    },
    onError(error) {
      console.log(error);
    },
  });
  useEffect(() => {
    if (list && list?.createdBy) {
      getCreatorUser();
      getCollaboratorUsers();
    }
  }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state?.sharedList) {
      if (sharedListResult) {
        const filterCompanylist = sharedListResult.find(
          (item: ISharedList) =>
            item.companyList?.id === state?.sharedList.id && item.companyList.name === state?.sharedList.name
        );

        if (filterCompanylist) {
          setTitleList(filterCompanylist?.companyList?.name);
          setList(filterCompanylist?.companyList);
        } else {
          setTitleList(state?.sharedList?.name);
        }
      }
    } else {
      if (lists.length > 0 && listId) {
        const list = lists.find(({ id }: any) => Number(id) === Number(listId));
        setList(list);
        setTitleList(list?.name);
      } else {
        setList(undefined);
      }
    }

    if (listName && listName !== '') {
      setTitleList(listName);
    }
  }, [listName, lists]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (viewMode === 'list') {
      setTabIndex(0);
    } else if (viewMode === 'map') {
      setTabIndex(1);
    } else if (viewMode === 'compare') {
      setTabIndex(2);
    }
  }, [viewMode]);

  useEffect(() => {
    if (list) {
      setTitleList(list.name);
    } else if (state?.listName) {
      setTitleList(state?.listName);
    } else {
      setTitleList(props.title);
    }
  }, [list, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack overflowX="hidden">
      <>
        <Text as="h1" textStyle="h1">
          {titleList}
          {editable && (
            <ListActionMenu
              list={{ id: listId, name: titleList, createdBy: list?.createdBy, userCreator: creator }}
              isCreator={isCreatorList}
            />
          )}
          {pathName === 'all' && <ModalCreateSupplier button={true} />}
        </Text>
        {!isCreatorList && creator && <Text>{`Created by ${creator?.givenName} ${creator?.surname}`}</Text>}
      </>
      {bannerForFavorite ? (
        <BannerWithPhoto
          title="Start Adding Companies"
          text="Once you've got companies in a list like Favorites, you can compare companies and view companies on a map."
          image={'/icons/man_looking_to_charts.svg'}
        />
      ) : (
        <Tabs isLazy index={tabIndex} onChange={(index: number) => setTabIndex(index)}>
          <TabList borderBottom="1px solid #E9E9E9" borderColor="#E9E9E9">
            <HStack justifyContent="space-between" w="full" mr="1rem">
              <Flex>
                <CustomTab
                  onClick={() => navigate(`/companies/${pathName === 'lists' ? 'lists/' + id : pathName}/list/1`)}
                >
                  <ListIcon style={{ fontSize: '1rem' }} />
                  <Text ml="2" textStyle="horizontalTabs">
                    {t('List')}
                  </Text>
                </CustomTab>
                <CustomTab
                  onClick={() => navigate(`/companies/${pathName === 'lists' ? 'lists/' + id : pathName}/map/1`)}
                >
                  <RoomIcon style={{ fontSize: '1rem' }} />
                  <Text ml="2" textStyle="horizontalTabs">
                    {t('Map')}
                  </Text>
                </CustomTab>
                <CustomTab
                  onClick={() => navigate(`/companies/${pathName === 'lists' ? 'lists/' + id : pathName}/compare/1`)}
                >
                  <SwapHorizSharpIcon style={{ fontSize: '1rem' }} />
                  <Text ml="2" textStyle="horizontalTabs">
                    {t('Compare')}
                  </Text>
                </CustomTab>
              </Flex>

              <HStack px="2px">
                <Flex>
                  <CompaniesSearch />
                  <CompaniesFilters />
                  <CompaniesSavedSearches />
                </Flex>
                {tabIndex === 2 && (
                  <>
                    <StimButton
                      {...(selectedMenu === 'transpose' && { bg: 'stimPrimary.light', color: 'stimNeutral.whites' })}
                      onClick={() => setSelectedMenu(selectedMenu === 'transpose' ? '' : 'transpose')}
                      size="stimSmall"
                      colorScheme="gradient.iconbutton"
                      variant="stimOutline"
                    >
                      {t('Transpose Table')}
                    </StimButton>
                  </>
                )}
              </HStack>
            </HStack>
          </TabList>
          <TabPanels>
            <TabPanel p="0">
              <CompanyList viewId={listId ?? pathName} tenant={tenant} bannerUp={setBannerForFavorite} />
            </TabPanel>
            <TabPanel>
              <CompaniesMap viewId={listId ?? pathName} />
            </TabPanel>
            <TabPanel>
              <Comparison viewId={listId ?? pathName} selectedMenu={selectedMenu} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Stack>
  );
};

export default Companies;
