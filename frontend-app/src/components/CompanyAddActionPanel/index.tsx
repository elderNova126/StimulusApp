import { useLazyQuery, useMutation } from '@apollo/client';
import { CheckIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, List, ListItem, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import LoadingSkeletonList from '../LoadingSkeletonList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import TCRMutations from '../../graphql/Mutations/TCRMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import ErrorStatus from '../../graphql/errors';
import { useStimulusToast } from '../../hooks';
import { CustomListCount, setCustomListsCount } from '../../stores/features/generalData';
import {
  capitalizeFirstLetter,
  getCompanyName,
  countRepeatedCompanies,
  findUniqueIds,
  removeDuplicates,
} from '../../utils/dataMapper';
import { CompanyLink, ProjectLink } from '../EntityLink';
import MessageComponent from '../GenericComponents/MessageComponent';
import ModalChangeStatus from './ModalChangeStatus';
import { GeneralTypeList } from '../../graphql/types';
import StimButton from '../ReusableComponents/Button';
const { GET_COMPANY_LISTS, COUNT_COMPANIES_LIST } = CompanyQueries;
const { AVAILABLE_PROJECTS_GQL } = ProjectQueries;
const { ADD_TO_COMPANY_LIST } = ListsMutations;
const { ADD_COMPANIES_TO_PROJECT, SET_COMPANY_TO_INTERNAL, SET_COMPANY_TYPE_INACTIVE, SET_COMPANY_TYPE_ARCHIVED } =
  CompanyMutations;

const { CHANGE_FAVORITE_SETTING_GQL } = TCRMutations;

const CompanyAddActionPanel = (props: {
  company?: any;
  companyIds?: string[];
  options?: { hideProjects?: boolean; hideLists?: boolean };
  profile?: boolean;
  setBulk?: (data: any) => void;
  setBulkComparison?: (data: any) => void;
}) => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [moreProjects, setMoreProjects] = useState(false);
  const [moreLists, setMoreLists] = useState(false);
  const [getAvailableProjects, { loading: loadingProjects, data: projectData }] = useLazyQuery(
    AVAILABLE_PROJECTS_GQL(),
    {
      fetchPolicy: 'network-only',
    }
  );
  const availableProjects = useMemo(() => projectData?.searchProjects?.results ?? [], [projectData]);

  const customListsCount: CustomListCount[] = useSelector((state: any) => state.generalData.customListsCount);
  const dispatch = useDispatch();
  const { company, companyIds, options, profile, setBulk, setBulkComparison } = props;
  const [addCompaniesToProject, { loading: projectLoading }] = useMutation(ADD_COMPANIES_TO_PROJECT);
  const [addCompanyToList, { loading: listLoading }] = useMutation(ADD_TO_COMPANY_LIST);
  const [addCompanyToInternal, { loading: internalLoading, data: internal }] = useMutation(SET_COMPANY_TO_INTERNAL, {
    refetchQueries: [
      {
        query: COUNT_COMPANIES_LIST,
        variables: {
          listType: GeneralTypeList.INTERNAL,
        },
      },
    ],
  });
  const [addCompanyToInactive, { loading: inactiveLoading, data: inactive }] = useMutation(SET_COMPANY_TYPE_INACTIVE);
  const [addCompanyToArchived, { loading: archivedLoading, data: archived }] = useMutation(SET_COMPANY_TYPE_ARCHIVED);
  const [statusTo, setStatusTo] = useState<any>([]);
  const [statusModal, setStatusModal] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [getLists, { data: dataLists, loading: loadingLists }] = useLazyQuery(GET_COMPANY_LISTS, {
    fetchPolicy: 'cache-first',
  });
  const availableLists = useMemo(() => dataLists?.companyLists?.results ?? [], [dataLists]);
  const isSimpleMenu = !!(options?.hideProjects || options?.hideLists);
  const { enqueueSnackbar } = useStimulusToast();

  useEffect(() => {
    getAvailableProjects();
    getLists();
  }, []);

  useEffect(() => {
    if (company?.tenantCompanyRelation?.type === 'external') {
      setStatusTo(['active']);
    } else {
      switch (company?.tenantCompanyRelation?.status) {
        case 'active':
          return setStatusTo(['inactive']);
        case 'inactive':
          return setStatusTo(['active', 'archive']);
        case 'archive':
          return setStatusTo([]);
        default:
          return setStatusTo([]);
      }
    }
  }, [company]);

  useEffect(() => {
    availableProjects.length < 3 ? setMoreProjects(true) : setMoreProjects(false);
  }, [availableProjects]);
  useEffect(() => {
    availableLists.length < 3 ? setMoreLists(true) : setMoreLists(false);
  }, [availableLists]);
  useEffect(() => {
    !projectLoading && setSelectedProject(null);
  }, [projectLoading]);
  useEffect(() => {
    !listLoading && setSelectedList(null);
  }, [listLoading]);

  const toast = useToast();
  const toastIdRef: any = useRef();
  function closeToast() {
    toast.close(toastIdRef.current);
  }

  const [changeFavoriteSetting, { loading: loadingFavorite }] = useMutation(CHANGE_FAVORITE_SETTING_GQL, {
    refetchQueries: [
      {
        query: COUNT_COMPANIES_LIST,
        variables: {
          listType: GeneralTypeList.FAVORITE,
        },
      },
    ],
  });
  const removeFavorite = (company: any) => {
    const { id, legalBusinessName } = company;
    const variables = { id, isFavorite: false };
    changeFavoriteSetting({
      variables,
    }).then(({ data }: any) => {
      if (!data.updateTenantCompanyRelation.errors) {
        toastIdRef.current = toast({
          render: () => (
            <MessageComponent
              actions="favoriteList"
              id={id.toString()}
              name={legalBusinessName}
              close={closeToast}
              isFavorite={data.updateTenantCompanyRelation.isFavorite}
            />
          ),
          id: data.updateTenantCompanyRelation.id,
        });
      }
    });
  };

  const addToList = (props: {
    listId: string;
    companiesList: any;
    listName: string;
    company: any;
    companyIds?: string[];
  }) => {
    const { listId, company, companyIds, companiesList, listName } = props;
    const count = countRepeatedCompanies(companiesList, companyIds ?? [company.id]);
    const uniqueIds = findUniqueIds(companiesList, companyIds ?? [company.id]);
    const repeatedCompaniesMsg =
      companyIds?.length === 1
        ? `The selected company was already on ${listName}`
        : `${count} of the ${(companyIds?.length as any) > 1 ? companyIds?.length : 1} selected companies ${
            count === 1 ? 'was' : 'were'
          } already on ${listName}`;
    if (uniqueIds.length) {
      addCompanyToList({
        variables: { listId, companyIds: company ? [company.id] : uniqueIds },
        update: (cache, { data: { addToCompanyList } }) => {
          const { id } = addToCompanyList;

          if (addToCompanyList.error) {
            if (addToCompanyList?.code === ErrorStatus.FAILED_PRECONDITION) {
              const message = t('An error has occurred. Please try again later!');
              toastIdRef.current = toast({
                render: () => <MessageComponent bg={'#e53e3e'} color="white" message={message} close={closeToast} />,
              });
            }
          } else {
            const companiesAdded = ((companyIds?.length as number) ?? [company.id].length) - count;

            const stringForMessage =
              !selectedList && selectedLists.indexOf(listId) < 0 ? t(' added to ') : t(' removed from ');
            const message = (
              <span>
                {company ? (
                  <CompanyLink id={company.id} name={getCompanyName(company)} />
                ) : (
                  t((companiesAdded as any) > 1 ? `${companiesAdded} Companies` : `1 Company`)
                )}
                {stringForMessage}
                {addToCompanyList.name}
              </span>
            );
            if (count > 0) {
              enqueueSnackbar(repeatedCompaniesMsg, { status: 'warning' });
            }
            if (companiesAdded >= 1) {
              enqueueSnackbar(message, { status: 'success' });
            }
            const currentList = customListsCount.filter((item: any) => Number(item.id) !== Number(listId));
            const uniqueCompanies: string[] = [];
            addToCompanyList?.companyIds?.forEach((id: string) => {
              if (!uniqueCompanies.includes(id)) {
                uniqueCompanies.push(id);
              }
            });

            const customListItemCount: CustomListCount = {
              id: Number(id),
              count: Number(uniqueCompanies.length),
            };
            dispatch(setCustomListsCount([...currentList, customListItemCount]));
          }
          if (setBulk) {
            setBulk([]);
          }
          if (setBulkComparison) {
            setBulkComparison([]);
          }
        },
      });
    } else {
      enqueueSnackbar(repeatedCompaniesMsg, { status: 'warning' });
      if (setBulk) {
        setBulk([]);
      }
      if (setBulkComparison) {
        setBulkComparison([]);
      }
    }
  };

  const addToProject = (props: {
    projectId: number;
    projectName: string;
    projectCompanies: any;
    company: any;
    companyIds?: string[];
  }) => {
    const { projectId, company, companyIds, projectName, projectCompanies } = props;
    const areInternasOrinactive = company
      ? company.tenantCompanyRelation?.status === 'inactive' || company.tenantCompanyRelation?.type === 'external'
      : false;
    const updatedProject = availableProjects.find((project: any) => project.id === projectId);
    const companies = projectCompanies?.map((projectCompany: any) => {
      const company: any = {};
      company.id = projectCompany?.company?.id;
      return company;
    });
    const count = countRepeatedCompanies(companies, companyIds ?? [company.id]);
    const uniqueIds = findUniqueIds(companies, companyIds ?? [company.id]);
    const companiesAdded = ((companyIds?.length as number) ?? [company.id].length) - count;
    const repeatedCompaniesMsg =
      companyIds?.length === 1
        ? `The selected company was already on ${projectName}`
        : `${count} of the ${(companyIds?.length as any) > 1 ? companyIds?.length : 1} selected companies ${
            count === 1 ? 'was' : 'were'
          } already on ${projectName}`;
    const message = (
      <span>
        {company ? (
          <CompanyLink id={company.id} name={getCompanyName(company)} />
        ) : (
          t((companiesAdded as any) > 1 ? `${companiesAdded} Companies` : `1 Company`)
        )}
        {t(' added to ')}
        <ProjectLink id={updatedProject.id} name={updatedProject.title} />
      </span>
    );
    if (uniqueIds.length) {
      addCompaniesToProject({
        variables: {
          projectId,
          companyIds: company ? [company.id] : uniqueIds,
          ...(company && { companyType: 'CONSIDERED' }),
        },
        update: (cache, { data: { addCompaniesToProject } }) => {
          if (addCompaniesToProject.error) {
            if (addCompaniesToProject?.code === ErrorStatus.FAILED_PRECONDITION) {
              const message = t('An error has occurred. Please try again later!');
              toastIdRef.current = toast({
                render: () => <MessageComponent bg={'#e53e3e'} color="white" message={message} close={closeToast} />,
              });
            }
          } else {
            if (areInternasOrinactive) {
              const message = (
                <span>
                  <CompanyLink id={company.id} name={getCompanyName(company)} />
                  {t(' , an external company, has been added to the project ')}
                  <ProjectLink id={updatedProject.id} name={updatedProject.title} />
                </span>
              );
              return (toastIdRef.current = toast({
                render: () => <MessageComponent message={message} close={closeToast} />,
              }));
            }

            if (count > 0) {
              enqueueSnackbar(repeatedCompaniesMsg, { status: 'warning' });
            }
            if (companiesAdded >= 1) {
              enqueueSnackbar(message, { status: 'success' });
            }
          }
          if (setBulk) {
            setBulk([]);
          }
          if (setBulkComparison) {
            setBulkComparison([]);
          }
        },
      });
    } else {
      enqueueSnackbar(repeatedCompaniesMsg, { status: 'warning' });
      if (setBulk) {
        setBulk([]);
      }
      if (setBulkComparison) {
        setBulkComparison([]);
      }
    }
  };

  const addToInternal = (company: any, statusTo: any) => {
    switch (statusTo) {
      case 'inactive':
        return addCompanyToInactive({
          variables: { companyId: company.id },
        }).then(({ data, errors }: any) => {
          if (data !== null) {
            const message = (
              <span>
                {company ? <CompanyLink id={company.id} name={getCompanyName(company)} /> : t('Companies')}
                {t(' status changed to Inactive.')}
              </span>
            );
            toastIdRef.current = toast({
              render: () => <MessageComponent message={message} close={closeToast} />,
            });
          } else if (errors) {
            const message = t('Cannot be made inactive if there are ongoing projects on the company.');
            toastIdRef.current = toast({
              render: () => <MessageComponent bg={'#e53e3e'} color="white" message={message} close={closeToast} />,
            });
          }
        });
      case 'archive':
        return addCompanyToArchived({
          variables: { companyId: company.id },
        }).then(({ data, errors }: any) => {
          if (data !== null) {
            const message = (
              <span>
                {company ? <CompanyLink id={company.id} name={getCompanyName(company)} /> : t('Companies')}
                {t(' status changed to Archived.')}
              </span>
            );

            toastIdRef.current = toast({
              render: () => <MessageComponent message={message} close={closeToast} />,
            });
          } else if (errors) {
            const message = t('Can only be archived if there is no activity on the company for 6 months.');
            toastIdRef.current = toast({
              render: () => <MessageComponent bg={'#e53e3e'} color="white" message={message} close={closeToast} />,
            });
          }
        });
      case 'active':
        return addCompanyToInternal({
          variables: { companyId: company.id },
        }).then(({ data, errors }: any) => {
          if (data !== null) {
            const message = (
              <span>
                {company ? <CompanyLink id={company.id} name={getCompanyName(company)} /> : t('Companies')}
                {t(' status changed to Active.')}
              </span>
            );
            toastIdRef.current = toast({
              render: () => <MessageComponent message={message} close={closeToast} />,
            });
          } else if (errors) {
            const message = t('Archived companies cannot change status.');
            toastIdRef.current = toast({
              render: () => <MessageComponent bg={'#e53e3e'} color="white" message={message} close={closeToast} />,
            });
          }
        });
      default:
        return null;
    }
  };

  const selectedCompanyProjects = useMemo(() => {
    return availableProjects.reduce((acc: any, curr: any) => {
      if (curr.projectCompany?.find(({ company: target }: any) => target?.id === company?.id)) {
        acc.push(curr.id);
      }
      return acc;
    }, []);
  }, [availableProjects, company]);

  const selectedLists = useMemo(() => {
    return availableLists.reduce((acc: any, curr: any) => {
      if (curr.companyIds?.find((target: any) => target === company?.id)) {
        acc.push(curr.id);
      }

      return acc;
    }, []);
  }, [availableLists, company]);

  return (
    <Stack direction="column" spacing={isSimpleMenu ? 2 : 5}>
      {!isSimpleMenu && !profile && (
        <Text as="h6" textStyle="h6" opacity=".7" p="12px 0 0 12px">
          {t('ADD TO')}
        </Text>
      )}
      {!options?.hideLists && (
        <Stack direction="column" spacing={4} marginTop="10px">
          {!isSimpleMenu && (
            <Text as="h4" textStyle="h4" pl="16px">
              {t('Lists')}
            </Text>
          )}
          <List spacing={3}>
            {loadingLists ? (
              <LoadingSkeletonList />
            ) : (
              <>
                {availableLists.length ? (
                  <>
                    {(moreLists ? availableLists : availableLists.slice(0, 2)).map((list: any) => (
                      <ListItem
                        key={list.id}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          if (!selectedList && selectedLists.indexOf(list.id) < 0) {
                            let companies = list?.companyIds?.map((id: string) => {
                              return { id };
                            });
                            companies = companies?.length ? removeDuplicates(companies) : [];
                            addToList({
                              listId: list.id,
                              companiesList: companies,
                              listName: list.name,
                              company,
                              companyIds,
                            });
                            setSelectedList(list.id);
                          }
                        }}
                      >
                        <StimButton
                          isFullWidth
                          justifyContent="flex-start"
                          size="stimSmall"
                          variant="stimTextButton"
                          _hover={{ bg: '#F6F6F6' }}
                          w="100%"
                          py="0 8px !important"
                          isLoading={selectedList === list.id && listLoading}
                          textDecoration="None"
                        >
                          <Stack direction="row" spacing="2">
                            <CheckIcon visibility={selectedLists.indexOf(list.id) > -1 ? 'visible' : 'hidden'} />
                            <Text textStyle="body" whiteSpace="nowrap" wordBreak="break-word">
                              {list.name}
                            </Text>
                          </Stack>
                        </StimButton>
                      </ListItem>
                    ))}
                  </>
                ) : (
                  <ListItem marginLeft="25px" mt="-5px">
                    <Text textStyle="body" whiteSpace="nowrap" wordBreak="break-word">
                      {t('No lists available')}
                    </Text>
                  </ListItem>
                )}
              </>
            )}
            {!moreLists && (
              <ListItem
                onClick={(e: any) => {
                  e.stopPropagation();
                  setMoreLists(true);
                }}
              >
                <StimButton
                  isFullWidth
                  justifyContent="flex-start"
                  size="stimSmall"
                  variant="stimTextButton"
                  _hover={{ bg: '#F6F6F6' }}
                  leftIcon={<CheckIcon visibility={'hidden'} />}
                  rightIcon={<ChevronRightIcon style={{ fontSize: '1rem' }} />}
                  w="100%"
                >
                  {t('More Lists')}
                </StimButton>
              </ListItem>
            )}
          </List>
        </Stack>
      )}

      {!options?.hideProjects && (
        <Stack direction="column" spacing={4} marginTop="10px">
          {!isSimpleMenu && (
            <Text as="h4" textStyle="h4" pl="16px">
              {t('Projects')}
            </Text>
          )}
          <List spacing={3}>
            {loadingProjects ? (
              <LoadingSkeletonList />
            ) : (
              <>
                {availableProjects.length ? (
                  <>
                    {(moreProjects ? availableProjects : availableProjects.slice(0, 2)).map((project: any) => (
                      <ListItem
                        key={project.id}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          if (!selectedProject && selectedCompanyProjects.indexOf(project.id) < 0) {
                            addToProject({
                              projectId: project.id,
                              company,
                              companyIds,
                              projectCompanies: project?.projectCompany ?? [],
                              projectName: project.title,
                            });
                            setSelectedProject(project.id);
                          }
                        }}
                      >
                        <StimButton
                          isFullWidth
                          justifyContent="flex-start"
                          size="stimSmall"
                          variant="stimTextButton"
                          _hover={{ bg: '#F6F6F6' }}
                          p="0 8px !important"
                          isLoading={selectedProject === project.id && projectLoading}
                          textDecoration="None"
                          w="100%"
                        >
                          <Stack direction="row" spacing="2">
                            <CheckIcon
                              visibility={selectedCompanyProjects.indexOf(project.id) > -1 ? 'visible' : 'hidden'}
                            />
                            <Text textStyle="body" whiteSpace="nowrap" wordBreak="break-word">
                              {project.title}
                            </Text>
                          </Stack>
                        </StimButton>
                      </ListItem>
                    ))}
                  </>
                ) : (
                  <ListItem marginLeft="25px" mt="-5px">
                    <Text textStyle="body" whiteSpace="normal" wordBreak="break-word">
                      {t('No ongoing projects available')}
                    </Text>
                  </ListItem>
                )}
              </>
            )}
            {!moreProjects && (
              <ListItem
                marginBottom="5px"
                onClick={(e: any) => {
                  e.stopPropagation();
                  setMoreProjects(true);
                }}
              >
                <StimButton
                  isFullWidth
                  justifyContent="flex-start"
                  size="stimSmall"
                  variant="stimTextButton"
                  w="100%"
                  _hover={{ bg: '#F6F6F6' }}
                  rightIcon={<ChevronRightIcon style={{ fontSize: '1rem' }} />}
                  leftIcon={<CheckIcon visibility={'hidden'} />}
                >
                  {t('More Projects')}
                </StimButton>
              </ListItem>
            )}
          </List>
        </Stack>
      )}

      {!isSimpleMenu && !!statusTo.length && (
        <Stack direction="column" spacing={4} paddingBottom="5px" marginTop="10px">
          <Text as="h4" textStyle="h4" pl="16px">
            {t('Status')}
          </Text>
          <List spacing={3}>
            {statusTo.map((status: string) => {
              return (
                <ListItem
                  key={status}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setStatusModal(status);
                    onOpen();
                  }}
                >
                  <StimButton
                    isFullWidth
                    justifyContent="flex-start"
                    size="stimSmall"
                    variant="stimTextButton"
                    w="100%"
                    _hover={{ bg: '#F6F6F6' }}
                    isLoading={status === statusModal ? internalLoading || inactiveLoading || archivedLoading : false}
                    p="0 8px !important"
                    textDecoration="None"
                  >
                    <Stack direction="row" spacing="2">
                      <CheckIcon
                        visibility={
                          (
                            status === statusModal
                              ? (statusModal === 'active' ? internal?.setCompanyActive : null) ||
                                (statusModal === 'inactive' ? inactive?.setCompanyInactive : null) ||
                                (statusModal === 'archive' ? archived?.setCompanyArchived : null)
                              : false
                          )
                            ? 'visible'
                            : 'hidden'
                        }
                      />
                      <Text textStyle="body" whiteSpace="nowrap" wordBreak="break-word" lineHeight="10px">
                        {t(capitalizeFirstLetter(status))}
                      </Text>
                    </Stack>
                  </StimButton>
                  <ModalChangeStatus
                    open={isOpen}
                    status={statusModal}
                    company={company}
                    changeStatus={() => addToInternal(company, statusModal)}
                    onClose={onClose}
                  />
                </ListItem>
              );
            })}
          </List>
        </Stack>
      )}
      {!isSimpleMenu && company?.tenantCompanyRelation?.isFavorite && profile && (
        <Stack direction="column" paddingBottom="10px">
          <Button
            as="div"
            cursor="pointer"
            variant="simple"
            _hover={{ bg: '#F6F6F6' }}
            onClick={() => removeFavorite(company)}
            isLoading={loadingFavorite}
          >
            <Text as="h4" textStyle="h4" whiteSpace="break-spaces">
              {t('Remove from Favorite List')}
            </Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
export default CompanyAddActionPanel;
