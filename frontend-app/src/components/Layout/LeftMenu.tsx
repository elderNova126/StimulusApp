import { useLazyQuery, useMutation } from '@apollo/client';
import { ChevronDownIcon, EmailIcon, SmallAddIcon } from '@chakra-ui/icons';
import { Image } from '@chakra-ui/image';
import { Box, Collapse, Divider, Flex, Skeleton, Stack } from '@chakra-ui/react';
import { navigate, RouteComponentProps } from '@reach/router';
import * as R from 'ramda';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ReflexContainer, ReflexElement } from 'react-reflex';
import { ISharedList, SharedListStatus } from '../../graphql/Models/SharedList';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ListQueries from '../../graphql/Queries/ListQueries';
import { GeneralTypeList } from '../../graphql/types';
import { useStimulusToast } from '../../hooks';
import { useCountCompaniesByList } from '../../hooks/ListsHooks';
import { setLimitCompanies, setLimitProjects, setSharedLists } from '../../stores/features/generalData';
import { resetProjectFormState } from '../../stores/features/projects';
import { removeDuplicates } from '../../utils/dataMapper';
import { PendingListInvitationModal } from '../SharedLists/PendingListInvitations';
import CustomSubMenuItem from './CustomSubMenuItem';
import CustomMenuItem from './CustomMenuItem';
import NewListModalContent from './NewListModalContent';
import SmallMenu from './SmallMenu';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import StimText from '../ReusableComponents/Text';
const { GET_INVITATIONS_LIST } = ListQueries;
const { GET_COMPANY_LISTS } = CompanyQueries;
const { CREATE_COMPANY_LIST } = ListsMutations;

const LeftMenu = (props: RouteComponentProps & { category: string; viewId: string; defaultOpen: boolean }) => {
  const { defaultOpen } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Flex minHeight="100%">
      <Box {...(menuOpen && { w: '30vh', minWidth: '227px' })} boxShadow="stimMedium" bg="stimNeutral.white">
        <Stack>
          <Collapse in={defaultOpen || menuOpen}>
            <SplitterView {...props} onMouseLeave={() => menuOpen && setMenuOpen(false)} />
          </Collapse>
          <Collapse in={!(defaultOpen || menuOpen)}>
            <SmallMenu setMenuOpen={setMenuOpen} open={menuOpen} />
          </Collapse>
        </Stack>
      </Box>
    </Flex>
  );
};

const SplitterView = (props: RouteComponentProps & { category: string; viewId: string; onMouseLeave: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { count: favoritesAmount, loading: loadingFavoritesAmount } = useCountCompaniesByList(GeneralTypeList.FAVORITE);
  const { count: internalAmount, loading: loadingInternalAmount } = useCountCompaniesByList(GeneralTypeList.INTERNAL);
  const { count: allCompaniesAmount, loading: loadingAllCompaniesAmount } = useCountCompaniesByList(
    GeneralTypeList.ALL
  );

  const [getLists, { data: dataLists, loading: loadingLists }] = useLazyQuery(GET_COMPANY_LISTS, {
    fetchPolicy: 'cache-first',
  });
  const [getSharedLists, { data: sharedList, loading: loadingSharedLists }] = useLazyQuery(GET_INVITATIONS_LIST, {
    onCompleted(data) {
      dispatch(setSharedLists(data?.GetSharedList?.results));
    },
    fetchPolicy: 'cache-first',
  });
  const sharedListResult: ISharedList[] = sharedList?.GetSharedList?.results;

  const [showMyList, setShowMyList] = useState(false);
  const [showInvitesList, setShowInvitesList] = useState(false);
  const [showFollowedList, setShowFollowedList] = useState(false);
  const [newListModalOpen, setNewListModalOpen] = useState(false);
  const lists = dataLists?.companyLists?.results ?? [];

  const sharedPendingListResult: ISharedList[] = sharedList
    ? sharedListResult?.filter((list: any) => list.status === SharedListStatus.PENDING && !!list.companyList)
    : [];
  const sharedApprovedListResult: ISharedList[] = sharedList
    ? sharedListResult?.filter((list: any) => list.status === SharedListStatus.APPROVED && !!list.companyList)
    : [];

  const { enqueueSnackbar } = useStimulusToast();
  const { category, viewId, onMouseLeave } = props;

  useEffect(() => {
    if (showMyList) getLists();
    if (showFollowedList) getSharedLists();
  }, [showMyList, showFollowedList]);

  const [createCompanyList, { loading: loadingList }] = useMutation(CREATE_COMPANY_LIST, {
    update: (cache, { data: { createCompanyList: newList } }) => {
      if (newList.id) {
        let { companyLists } = R.clone(
          cache.readQuery({ query: GET_COMPANY_LISTS }) ?? {
            results: [],
          }
        );
        companyLists = { results: [...(companyLists?.results ?? []), newList] };
        enqueueSnackbar(t('New list created'), { status: 'success' });
        cache.writeQuery({
          query: GET_COMPANY_LISTS,
          data: { companyLists },
        });
        setNewListModalOpen(false);
        navigate(`/companies/lists/${newList.id}/list/1`);
      }
    },
  });

  return (
    <Box onMouseLeave={onMouseLeave} w="30vh" minWidth="227px" data-testid="splitter-view">
      <ReflexContainer orientation="horizontal">
        <ReflexElement className="left-pane" minSize={200} maxSize={800}>
          <Flex
            bg="linear-gradient(360deg, rgba(249, 254, 251, 0) 0%, rgba(249, 254, 251, 0.8) 100%)"
            height="100%"
            p={'1.5rem'}
            className="pane-content"
            direction="column"
          >
            <Flex justifyContent="center" alignItems="center">
              <Image
                w="141px"
                h="40.6px"
                src="/stimuluslogo.png"
                alt="STIMULUS"
                onClick={() => {
                  dispatch(setLimitCompanies(10));
                  return navigate('/companies/all/list/1');
                }}
                cursor="pointer"
              />
            </Flex>
            <StimText variant="stimSmallCaption" mt="3rem" px="0.5rem">
              {t('DASHBOARD')}
            </StimText>
            <CustomMenuItem
              active={category === 'dashboard'}
              title={'Home'}
              onClick={() => {
                return navigate('/dashboard');
              }}
            />
            <Divider my="0.5rem" />
            <Flex>
              <StimText variant="stimSmallCaption" my="0.5rem" px="0.5rem">
                {t('COMPANIES')}
              </StimText>
            </Flex>
            <Flex direction="column" justifyContent="flex-start">
              <CustomMenuItem
                active={viewId === 'all'}
                title={'All'}
                total={loadingAllCompaniesAmount ? '...' : allCompaniesAmount}
                dataCy="all-companies"
                onClick={() => {
                  dispatch(setLimitCompanies(10));
                  return navigate('/companies/all/list/1');
                }}
              />
              <CustomMenuItem
                active={viewId === 'internal'}
                title={'Internal'}
                total={loadingInternalAmount ? '...' : internalAmount}
                onClick={() => {
                  dispatch(setLimitCompanies(10));
                  return navigate('/companies/internal/list/1');
                }}
              />
              <CustomMenuItem
                active={viewId === 'favorites'}
                title={'Favorites'}
                total={loadingFavoritesAmount ? '...' : favoritesAmount}
                onClick={() => {
                  dispatch(setLimitCompanies(10));
                  return navigate('/companies/favorites/list/1');
                }}
              />
              <CustomMenuItem
                active={false}
                data-testid="my-list-menu"
                onClick={() => setShowMyList(!showMyList)}
                rightIcon={<ChevronDownIcon {...(showMyList && { transform: 'rotate(180deg)' })} />}
                title={'My Lists'}
              />
              {showMyList && (
                <>
                  {loadingLists ? (
                    <LoadingListSkeleton />
                  ) : (
                    <Box ml="10px" data-testid="my-list">
                      {lists.map((list: any, i: number) => {
                        const companies: any = list?.companyIds?.map((id: string) => {
                          return {
                            id,
                          };
                        });
                        const count: any = removeDuplicates(companies);
                        return (
                          <CustomMenuItem
                            key={`${list.id}_${i}`}
                            active={viewId === list.id}
                            onClick={() => {
                              dispatch(setLimitCompanies(10));
                              return navigate(`/companies/lists/${list.id}/list/1`, {
                                state: {
                                  listName: list.name,
                                },
                              });
                            }}
                            total={count?.length ?? '...'}
                            title={list.name}
                          />
                        );
                      })}
                      <CustomMenuItem
                        active={newListModalOpen}
                        rightIcon={<SmallAddIcon />}
                        onClick={() => setNewListModalOpen(true)}
                        title={'New List'}
                      />
                    </Box>
                  )}
                </>
              )}

              <CustomMenuItem
                active={false}
                onClick={() => setShowFollowedList(!showFollowedList)}
                rightIcon={<ChevronDownIcon {...(showFollowedList && { transform: 'rotate(180deg)' })} />}
                title={'Followed'}
              />

              {showFollowedList && (
                <>
                  {loadingSharedLists ? (
                    <LoadingListSkeleton />
                  ) : (
                    <Box ml="20px">
                      {sharedApprovedListResult?.map((list: any, i: number) => (
                        <CustomSubMenuItem
                          key={`${list.id}_${i}`}
                          onClick={() => {
                            dispatch(setLimitCompanies(10));
                            return navigate(`/companies/lists/${list.companyList.id}/list/1`, {
                              state: {
                                sharedList: list.companyList,
                                tenant: list.tenant,
                                listName: list.companyList.name,
                              },
                            });
                          }}
                          title={list.companyList && list.companyList.name}
                          total={list.companyList && list.companyList.companies ? list.companyList.companies.length : 0}
                        />
                      ))}
                      <CustomSubMenuItem
                        onClick={() => setShowInvitesList(!showInvitesList)}
                        title={'Invites'}
                        leftIcon={<EmailIcon />}
                        total={sharedPendingListResult?.length ?? '...'}
                      />
                    </Box>
                  )}
                </>
              )}
              <PendingListInvitationModal
                isOpen={showInvitesList}
                onClose={() => setShowInvitesList(!showInvitesList)}
                listInvitations={sharedPendingListResult}
              />
            </Flex>
            <Divider my="0.5rem" />

            <StimText variant="stimSmallCaption" my="0.5rem" px="0.5rem">
              {t('PROJECTS')}
            </StimText>

            <CustomMenuItem
              active={category === 'projects'}
              title={'All Projects'}
              onClick={() => {
                dispatch(setLimitProjects(5));
                navigate('/projects/1');
                dispatch(resetProjectFormState());
              }}
              dataCy="projects-page"
            />
            <Divider my="0.5rem" />
            <StimText variant="stimSmallCaption" my="0.5rem" px="0.5rem">
              {t('REPORTS')}
            </StimText>

            <CustomMenuItem
              active={category === 'pbreport'}
              title={'All Reports'}
              onClick={() => {
                navigate('/pbreport');
              }}
            />
          </Flex>
        </ReflexElement>
      </ReflexContainer>

      {/* CREATE NEW LIST MODAL */}
      <NewListModalContent
        close={() => setNewListModalOpen(false)}
        loadingList={loadingList}
        newListModalOpen={newListModalOpen}
        createCompanyList={createCompanyList}
      />
    </Box>
  );
};

const LoadingListSkeleton = () => {
  return (
    <Stack spacing={2} mt="10px" justifyContent={'flex-end'} alignItems={'flex-end'}>
      <Skeleton height="20px" borderRadius={'12px'} width={'90%'} startColor="green.100" endColor="white" />
      <Skeleton height="20px" borderRadius={'12px'} width={'90%'} startColor="green.100" endColor="white" />
      <Skeleton height="20px" borderRadius={'12px'} width={'90%'} startColor="green.100" endColor="white" />
    </Stack>
  );
};

export default withLDConsumer()(LeftMenu) as any;
