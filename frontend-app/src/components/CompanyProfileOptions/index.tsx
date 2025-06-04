// @todo: This is part of the old design, make sure you delete this before releasing v3.
import { useMutation } from '@apollo/client';
import { Button, Text } from '@chakra-ui/react';
import Popover from '@material-ui/core/Popover';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CheckIcon from '@material-ui/icons/Check';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DescriptionIcon from '@material-ui/icons/Description';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import StarIcon from '@material-ui/icons/Star';
import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import clsx from 'clsx';
import * as R from 'ramda';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OpenProjectsContext } from '../../context/OpenProjectsContext';
import ErrorStatus from '../../graphql/errors';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import TCRMutations from '../../graphql/Mutations/TCRMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useStimulusToast } from '../../hooks';
import { getCompanyName } from '../../utils/dataMapper';
import { CommonLink, CompanyLink, ProjectLink } from '../EntityLink';
import useStyles from './style';
const { AVAILABLE_PROJECTS_GQL } = ProjectQueries;
const { COMPANY_DETAILS_GQL, COMPANIES_TO_COMPARE_GQL, SCORE_COMPARISON_GQL } = CompanyQueries;
const { SET_COMPANY_TO_INTERNAL, SET_COMPANY_TYPE_ACTIVE, SET_COMPANY_TYPE_INACTIVE } = CompanyMutations;
const { UPDATE_PROJECT_COMPANIES } = ProjectMutations;
const { CHANGE_COMPARISON_SETTING_GQL, CHANGE_FAVORITE_SETTING_GQL } = TCRMutations;

const CompanyProfileOptions = (props: { company: any }) => {
  const { t } = useTranslation();
  const { company } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const profileOptionsOpen = Boolean(anchorEl);
  const { projects: openProjects } = useContext(OpenProjectsContext);
  const { enqueueSnackbar } = useStimulusToast();
  const companiesToCompare: any[] = [];
  const [addCompanyToProject] = useMutation(UPDATE_PROJECT_COMPANIES);

  const [convertToInternal] = useMutation(SET_COMPANY_TO_INTERNAL, {
    refetchQueries: [{ query: COMPANY_DETAILS_GQL, variables: { id: company.id } }],
    update(cache, { data: { setCompanyTypeToInternal, setCompanyActive } }) {
      if (setCompanyTypeToInternal && setCompanyActive) {
        enqueueSnackbar(t('Company was converted to internal'), { status: 'success' });
      }
    },
  });

  const [convertToActive] = useMutation(SET_COMPANY_TYPE_ACTIVE, {
    refetchQueries: [{ query: COMPANY_DETAILS_GQL, variables: { id: company.id } }],
    update(cache, { data: setCompanyActive }) {
      if (setCompanyActive) {
        enqueueSnackbar(t('Company was converted to active'), { status: 'success' });
      }
    },
  });

  const [convertToInactive] = useMutation(SET_COMPANY_TYPE_INACTIVE, {
    refetchQueries: [{ query: COMPANY_DETAILS_GQL, variables: { id: company.id } }],
    update(cache, { data: setCompanyInactive }) {
      if (setCompanyInactive) {
        enqueueSnackbar(t('Company was converted to inactive'), { status: 'success' });
      }
    },
  });

  const updateCompanyCache = (cache: any, data: any) => {
    const {
      data: { updateTenantCompanyRelation: companySettings },
    } = data;
    const { searchCompanies } = R.clone(
      cache.readQuery({ query: COMPANY_DETAILS_GQL, variables: { id: company.id } })
    ) as any;
    const cachedCompany = searchCompanies.results?.[0];
    cachedCompany.updateTenantCompanyRelation = { ...cachedCompany.updateTenantCompanyRelation, ...companySettings };

    searchCompanies.results = [cachedCompany];
    cache.writeQuery({
      query: COMPANY_DETAILS_GQL,
      variables: { id: cachedCompany.id },
      data: { searchCompanies: { ...searchCompanies } },
    });
  };

  const [changeFavoriteSetting] = useMutation(CHANGE_FAVORITE_SETTING_GQL, {
    update: updateCompanyCache,
  });

  const [changeComparisonSetting] = useMutation(CHANGE_COMPARISON_SETTING_GQL, {
    refetchQueries: [{ query: SCORE_COMPARISON_GQL() }],
    update: (cache, data) => {
      const {
        data: { updateTenantCompanyRelation: companySettings },
      } = data;

      const { searchCompanies } = R.clone(cache.readQuery({ query: COMPANIES_TO_COMPARE_GQL })) as any;
      const { results: companies } = searchCompanies;
      const { isToCompare } = companySettings;
      searchCompanies.results = isToCompare
        ? [
            ...(companies ?? []),
            {
              id: company.id,
              legalBusinessName: company?.legalBusinessName,
              doingBusinessAs: company?.doingBusinessAs,
              __typename: 'Company',
            },
          ] // adding empty legalBusinessName to match apollo types
        : companies.filter(({ id }: any) => id !== company.id);

      cache.writeQuery({
        query: COMPANIES_TO_COMPARE_GQL,
        data: { searchCompanies: { ...searchCompanies } },
      });

      updateCompanyCache(cache, data);
    },
  });

  const handleChangeFavorite = (e: any) => {
    const { id, tenantCompanyRelation } = company;

    const isFavorite = tenantCompanyRelation?.isFavorite;
    handleClosePopover();

    changeFavoriteSetting({
      variables: { id, isFavorite: !isFavorite },
      optimisticResponse: {
        updateTenantCompanyRelation: {
          __typename: 'TenantCompanyRelation',
          id,
          isFavorite: !isFavorite,
        },
      },
    }).then(() => {
      const { id } = company;
      const message = (
        <span>
          <CompanyLink id={id} name={getCompanyName(company)} />
          {t(' was ')}
          {!isFavorite ? t(' added to ') : t(' removed from ')}
          <CommonLink name="Favorites" target="companies" />
        </span>
      );
      enqueueSnackbar(message, { status: 'success' });
    });
  };

  const handleToggleToProject = (project: any, companyType: string) => {
    handleClosePopover();
    const { id: projectId } = project;
    addCompanyToProject({
      variables: { projectId, companyId: company.id, companyType },
      update: (cache, { data: { updateProjectCompanies: newProjectCompany } }) => {
        if (newProjectCompany.error) {
          if (newProjectCompany.code === ErrorStatus.FAILED_PRECONDITION) {
            const message = t('Company needs to be internal and active');
            enqueueSnackbar(message, { status: 'error' });
          }
        } else {
          const { id } = company;
          const isRemoved = !companyType;

          const { searchProjects } = R.clone(cache.readQuery({ query: AVAILABLE_PROJECTS_GQL() })) as any;

          searchProjects.results = searchProjects?.results?.map?.((project: any) => {
            if (project.id === projectId) {
              project.projectCompany = !companyType
                ? project.projectCompany?.filter((relation: any) => relation.company.id !== id)
                : [
                    ...(project.projectCompany ?? []),
                    { ...newProjectCompany, company: { id: newProjectCompany.companyId } },
                  ];
            }
            return { ...project };
          });

          cache.writeQuery({
            query: AVAILABLE_PROJECTS_GQL(),
            data: { searchProjects: { ...searchProjects } },
          });

          const message = (
            <span>
              <CompanyLink id={id} name={getCompanyName(company)} />
              {t(' was ')}
              {isRemoved ? t('removed from ') : t('considered to ')}
              <ProjectLink id={projectId} name={project.title} />
            </span>
          );
          enqueueSnackbar(message, { status: 'success' });
        }
      },
    });
  };

  const handleChangeComparison = (e: any) => {
    const { id, tenantCompanyRelation } = company;
    const isToCompare = tenantCompanyRelation?.isToCompare;

    handleClosePopover();
    if (!isToCompare && companiesToCompare.length > 3) {
      enqueueSnackbar(t('You can compare only 4 companies at the same time'), { status: 'error' });
    } else {
      changeComparisonSetting({
        variables: { id, isToCompare: !isToCompare },
        optimisticResponse: {
          updateTenantCompanyRelation: {
            __typename: 'TenantCompanyRelation',
            id,
            isToCompare: !isToCompare,
          },
        },
      }).then(({ data: { updateTenantCompanyRelation } }) => {
        if (updateTenantCompanyRelation?.error) {
          if (updateTenantCompanyRelation?.code === ErrorStatus.FAILED_PRECONDITION) {
            const message = t('Company needs to be internal and active');
            enqueueSnackbar(message, { status: 'error' });
          }
        } else {
          const { id } = company;
          const message = (
            <span>
              <CompanyLink id={id} name={getCompanyName(company)} />
              {!isToCompare ? t(' added to ') : t(' removed from ')}
              <CommonLink name="Comparison" target="comparison" />
            </span>
          );
          enqueueSnackbar(message, { status: 'success' });
        }
      });
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const {
    tenantCompanyRelation: { type, status },
  } = company;
  const isExternal = type === 'external';
  const isActive = status === 'active';

  return (
    <div>
      <Button variant="contained" onClick={handleClick} className={classes.profileOptions}>
        {t('Profile Options')}
        {profileOptionsOpen ? (
          <ArrowDropDownIcon className={classes.showDetailsIcon} fontSize="small" />
        ) : (
          <ArrowDropUpIcon className={classes.showDetailsIcon} fontSize="small" />
        )}
      </Button>
      <Popover
        elevation={0}
        open={profileOptionsOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.typography}>
          <div className={classes.popupItem}>
            <div className={clsx(classes.popupItemHeader, classes.actionItem)} onClick={handleChangeFavorite}>
              {company?.tenantCompanyRelation?.isFavorite ? (
                <StarIcon className={classes.icon} />
              ) : (
                <StarsOutlinedIcon className={classes.icon} />
              )}
              <Text className={classes.popupItemHeaderName}>
                {company?.tenantCompanyRelation?.isFavorite ? t('Remove From Favorites') : t('Add To Favorites')}
              </Text>
            </div>
          </div>
          {isExternal ? (
            <div className={classes.popupItem}>
              <div
                className={clsx(classes.popupItemHeader, classes.actionItem)}
                onClick={() => {
                  convertToInternal({ variables: { companyId: company.id } });
                  handleClosePopover();
                }}
              >
                <AddCircleOutlineIcon className={classes.icon} />
                <Text className={classes.popupItemHeaderName}>{t('Convert To Internal')}</Text>
              </div>
            </div>
          ) : (
            <div className={classes.popupItem}>
              <div
                className={clsx(classes.popupItemHeader, classes.actionItem)}
                onClick={() => {
                  if (isActive) {
                    convertToInactive({ variables: { companyId: company.id } });
                  } else {
                    convertToActive({ variables: { companyId: company.id } });
                  }

                  handleClosePopover();
                }}
              >
                {isActive ? (
                  <RemoveCircleOutlineIcon className={classes.icon} />
                ) : (
                  <AddCircleOutlineIcon className={classes.icon} />
                )}
                <Text className={classes.popupItemHeaderName}>
                  {t('Convert To ')}
                  {isActive ? t('Inactive') : t('Active')}
                </Text>
              </div>
            </div>
          )}
          {!isExternal && isActive && (
            <>
              <div className={classes.popupItem}>
                <div className={classes.popupItemHeader}>
                  <DescriptionIcon className={classes.icon} />
                  <div className={classes.popupItemHeaderName}>
                    <span>{t('Add To Project')}</span>
                  </div>
                </div>
                <div className={clsx(classes.popupItemBody, classes.actionItem)}>
                  {(openProjects || []).map((project: any) => {
                    const projectCompanies = project.projectCompany || [];
                    const isPartOfCurrentProject = projectCompanies.find(
                      (relation: any) => relation?.company?.id === company.id
                    );
                    const checkIcon = isPartOfCurrentProject ? <CheckIcon className={classes.icon} /> : null;
                    const companyType = isPartOfCurrentProject ? '' : 'CONSIDERED';
                    const itemClass = isPartOfCurrentProject ? classes.active : '';
                    return (
                      <div
                        key={project.id}
                        className={clsx(classes.popupItemBodyItem, itemClass)}
                        onClick={() => handleToggleToProject(project, companyType)}
                      >
                        {checkIcon}
                        <span>{project.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={classes.popupItem}>
                <div className={clsx(classes.popupItemHeader, classes.actionItem)} onClick={handleChangeComparison}>
                  <CompareArrowsIcon className={classes.icon} />
                  <div className={classes.popupItemHeaderName}>
                    <span>
                      {company?.tenantCompanyRelation?.isToCompare
                        ? t('Remove From Comparison With')
                        : t('Add To Comparison With')}
                    </span>
                  </div>
                </div>
                <div className={classes.popupItemBody}>
                  {(companiesToCompare || []).map((companyToCompare: any) => {
                    return (
                      companyToCompare.id !== company.id && (
                        <div key={companyToCompare.id} className={classes.popupItemBodyItem}>
                          <span>{getCompanyName(companyToCompare)}</span>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default CompanyProfileOptions;
