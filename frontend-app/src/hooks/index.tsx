import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import jwt_decode from 'jwt-decode';
import { Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MessageComponent from '../components/GenericComponents/MessageComponent';
import config from '../config/environment.config';
import { AssetContext } from '../context/AssetUri/index';
import { AuthContext } from '../context/Auth/index';
import { LocalStorageContext } from '../context/LocalStorage/index';
import { Coordinates, Position } from '../graphql/types';
import { navigate } from '@reach/router';
import ErrorStatus from '../graphql/errors';
import CompanyQueries from '../graphql/Queries/CompanyQueries';
import UserQueries from '../graphql/Queries/UserQueries';
import EvaluationQueries from '../graphql/Queries/EvaluationQueries';
import ProjectQueries from '../graphql/Queries/ProjectQueries';
import TenantQueries from '../graphql/Queries/TenantQueries';
import { ReportsTypes } from '../components/PowerBiReport/report.types';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyUpdateState } from '../stores/features/company';
import { setJurisdictionOfIncorporation } from '../stores/features/company';

const { USER_TENANTS } = UserQueries;
const { COMPANY_OR_USER_ASSETS, SEARCH_INTERNAL_COMPANIES_DASHBOARD, CHECK_INTERNAL_DASHBOARD } = CompanyQueries;
const { SEARCH_TOTALSPEND_DASHBOARD, CHECK_TOTALSPENT_DASHBOARD } = EvaluationQueries;
const { SEARCH_PROJECTS_DASHBOARD, PROJECTS_GQL, CHECK_PROJECTS_DASHBOARD } = ProjectQueries;
const { ACTIVITY_LOG_GQL } = TenantQueries;
enum ProvisionStatus {
  PROVISIONED = 'provisioned',
  IN_PROGRESS = 'in_progress',
  QUEUED = 'queued',
}

interface UserTenant {
  id: number;
  isDefault: boolean;
  provisionStatus: ProvisionStatus;
}
const getDefaultTenant = (client: any) => {
  return client
    .query({
      query: USER_TENANTS(),
    })
    .then((results: { data: { userTenants: UserTenant[] } }) => {
      const { userTenants } = results.data;

      return userTenants?.length ? userTenants.find((tenant) => tenant.isDefault) || userTenants[0] : null;
    });
};

const issueContextToken = (client: any, tenant: UserTenant): string | null => {
  if (!tenant || !tenant.id) {
    return null;
  }

  return client
    .mutate({
      mutation: gql`
      mutation{
        issueContextToken(tenantId: "${tenant.id}"){
          token
        }
      }
    `,
    })
    .then((results: { data: { issueContextToken: { token: string } } }) => {
      return results.data.issueContextToken.token;
    });
};

const checkProvisionStatus = (tenant: UserTenant) => {
  if (!tenant) {
    return;
  }

  return new Promise((resolve, reject) => {
    const { provisionStatus } = tenant;
    switch (provisionStatus) {
      case ProvisionStatus.PROVISIONED:
        return resolve(tenant);
      case ProvisionStatus.IN_PROGRESS:
      case ProvisionStatus.QUEUED:
      default:
        return reject({ code: 'provision', provisionStatus });
    }
  });
};

const useTenantContext = (client: any) => {
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [waitForProvisioning, setWaitForProvisioning] = useState<boolean | null>(null);
  const [provisioningStatus, setProvisioningStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { tenantToken, setTenantToken } = useContext(LocalStorageContext);
  const { authToken, reloadToken, user } = useContext(AuthContext);

  useEffect(() => {
    if (authToken !== undefined && authToken !== '') {
      if (!tenantToken) {
        getDefaultTenant(client)
          .then(checkProvisionStatus)
          .then(issueContextToken.bind(null, client))
          .then((token: string) => {
            if (token) {
              setTenantToken(token);
            }
            return token;
          })
          .then((token: string) => {
            if (token) {
              setIsNewUser(false);
            } else {
              setIsNewUser(true);
            }
            setLoading(false);
          })
          .catch((err: any) => {
            if (err.code === 'provision') {
              setWaitForProvisioning(true);
              setProvisioningStatus(err.provisionStatus);
              setIsNewUser(false);
            }
            setLoading(false);
          });
      } else {
        setIsNewUser(false);
        setLoading(false);
      }
    } else {
      reloadToken();
    }
  }, [isNewUser, loading, client, authToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, loading, isNewUser, waitForProvisioning, provisioningStatus };
};

const useErrorTranslation = () => {
  const { t } = useTranslation();

  return {
    [ErrorStatus.UNAUTHENTICATED]: t('Insufficient permissions'),
    [ErrorStatus.INVALID_ARGUMENT]: t('Invalid request. This operation cannot be performed!'),
    [ErrorStatus.NOT_FOUND]: t('Target not found!'),
    [ErrorStatus.PERMISSION_DENIED]: t('Insufficient permissions'),
  } as any;
};

const useTimeout = (props: {
  active: boolean;
  callback: () => void;
  timeout: number; // delay, ms
}): (() => void) => {
  const { active, callback, timeout } = props;
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

  const cancel = useCallback(() => {
    const timeoutId = timeoutIdRef.current;
    if (timeoutId) {
      timeoutIdRef.current = undefined;
      clearTimeout(timeoutId);
    }
  }, [timeoutIdRef]);

  useEffect(() => {
    if (active) {
      timeoutIdRef.current = setTimeout(callback, timeout || 0);
      return cancel;
    }
  }, [callback, timeout, cancel, active]);

  return cancel;
};

export enum useStimulusToastStatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

const useStimulusToast = () => {
  const toast = useToast();
  const toastIdRef: any = useRef();

  return {
    enqueueSnackbar: (message: ReactNode, options?: any, actions?: string, bulk?: any) => {
      const bg: string =
        options?.status === useStimulusToastStatusEnum.ERROR
          ? '#e53e3e'
          : options?.status === useStimulusToastStatusEnum.WARNING
            ? '#11b2bc'
            : 'white';
      const color: string = options?.status === useStimulusToastStatusEnum.SUCCESS ? 'black' : 'white';
      toastIdRef.current = toast({
        render: () => (
          <MessageComponent
            bulkSelected={bulk}
            actions={actions as any}
            message={message}
            bg={bg}
            color={color}
            close={() => toast.closeAll()}
          />
        ),
      });
    },
  };
};

const useAssetUri = (options: { companyId?: string; userId?: any }) => {
  const [assetUri, setAssetUri] = useState<string>('');
  const { authToken } = useToken();
  const { tenantToken } = useContext(LocalStorageContext);
  const { cacheUri, setCacheUri } = useContext(AssetContext);
  const { companyId, userId } = options;
  const { data } = useQuery(COMPANY_OR_USER_ASSETS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      ...(!!companyId && { companyId }),
      ...(!!userId && { userId }),
    },
  });
  const assetId = data?.assetDetails?.results?.[0]?.asset?.id;

  const fetchAsset = useCallback(
    (assetId: string) => {
      return fetch(`${config.REST_URI}/asset/${assetId}`, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : '',
          ...(tenantToken && { 'x-scope-context': tenantToken }),
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const uri = URL.createObjectURL(blob);
          setAssetUri(uri);
          setCacheUri((prevCacheUri: any) => ({ ...prevCacheUri, [assetId]: uri }));
        });
    },
    [authToken, tenantToken, setCacheUri]
  );

  const clearAsset = () => {
    setAssetUri('');
    setCacheUri({ ...cacheUri, [assetId]: '' });
  };

  useEffect(() => {
    if (cacheUri?.[assetId] !== assetUri) {
      setAssetUri(cacheUri?.[assetId]);
    }
  }, [assetId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (assetId) {
      if (cacheUri?.[assetId]?.length) {
        setAssetUri(cacheUri[assetId]);
      } else {
        const state = { update: true };
        fetchAsset(assetId);
        return () => {
          state.update = false;
        };
      }
    }
  }, [assetId, fetchAsset]); // eslint-disable-line react-hooks/exhaustive-deps

  return { assetUri, refetch: (assetId: string) => fetchAsset(assetId), clearAsset };
};

const useLazyAssetUri = () => {
  const [assetUri, setAssetUri] = useState<string>('');
  const { authToken } = useToken();
  const { tenantToken } = useContext(LocalStorageContext);
  const [getAsset, { data, variables }] = useLazyQuery(COMPANY_OR_USER_ASSETS, { fetchPolicy: 'cache-first' });
  const assetId = data?.assetDetails?.results?.[0]?.asset?.id;
  const { cacheUri, setCacheUri } = useContext(AssetContext);

  const fetchAsset = useCallback(
    (assetId: string) => {
      return fetch(`${config.REST_URI}/asset/${assetId}`, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : '',
          ...(tenantToken && { 'x-scope-context': tenantToken }),
        },
      })
        .then((res) => (res.ok ? res.blob() : null))
        .then((blob: any) => {
          const uri = blob ? URL.createObjectURL(blob) : null;
          setCacheUri((prevCacheUri: any) => ({ ...prevCacheUri, [assetId]: uri }));
        });
    },
    [authToken, tenantToken, cacheUri, setCacheUri]
  );

  const clearAsset = () => {
    setAssetUri('');
    setCacheUri({ ...cacheUri, [assetId]: '' });
  };

  useEffect(() => {
    if (cacheUri?.[assetId] && cacheUri[assetId] !== assetUri) {
      setAssetUri(cacheUri[assetId]);
    }
  }, [assetId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (assetId) {
      if (cacheUri?.[assetId]?.length) {
        setAssetUri(cacheUri[assetId]);
      } else {
        fetchAsset(assetId);
      }
    } else {
      setAssetUri('');
    }
  }, [assetId, fetchAsset]);

  return [getAsset, { assetUri, refetch: (assetId: string) => fetchAsset(assetId), clearAsset, variables }] as any;
};

const useProjectAttachmentUri = (attachmentId: string) => {
  const [attachmentUri, setAttachmentUri] = useState<string>('');
  const { authToken } = useToken();
  const { tenantToken } = useContext(LocalStorageContext);
  const { cacheUri, setCacheUri } = useContext(AssetContext);

  const fetchAsset = useCallback(
    (attachmentId: string) => {
      return fetch(`${config.REST_URI}/attachment/${attachmentId}`, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : '',
          ...(tenantToken && { 'x-scope-context': tenantToken }),
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const uri = URL.createObjectURL(blob);
          setAttachmentUri(uri);
          setCacheUri((cacheUri: any) => ({ ...cacheUri, [attachmentId]: { loading: false, uri } }));
        });
    },
    [authToken, tenantToken] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (attachmentId) {
      if (typeof cacheUri[attachmentId] === 'undefined') {
        setCacheUri((cacheUri: any) => ({ ...cacheUri, [attachmentId]: { loading: true, uri: null } }));
        fetchAsset(attachmentId);
      } else if (cacheUri[attachmentId]?.uri && !cacheUri[attachmentId].loading) {
        setAttachmentUri(cacheUri[attachmentId].uri);
      }
    }
  }, [attachmentId, fetchAsset]); // eslint-disable-line react-hooks/exhaustive-deps

  return { attachmentUri, refetch: (attachmentId: string) => fetchAsset(attachmentId) };
};

const useCompanyAttachmentUri = (attachmentId: string) => {
  const [attachmentUri, setAttachmentUri] = useState<string>('');
  const { authToken } = useToken();
  const { tenantToken } = useContext(LocalStorageContext);
  const { cacheUri, setCacheUri } = useContext(AssetContext);

  const fetchAsset = useCallback(
    (attachmentId: string) => {
      return fetch(`${config.REST_URI}/company-attachment/${attachmentId}`, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : '',
          ...(tenantToken && { 'x-scope-context': tenantToken }),
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          console.log(blob, attachmentId);
          const uri = URL.createObjectURL(blob);
          setAttachmentUri(uri);
          setCacheUri((cacheUri: any) => ({ ...cacheUri, [attachmentId]: { loading: false, uri } }));
        });
    },
    [authToken, tenantToken] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (attachmentId) {
      if (typeof cacheUri[attachmentId] === 'undefined') {
        setCacheUri((cacheUri: any) => ({ ...cacheUri, [attachmentId]: { loading: true, uri: null } }));
        fetchAsset(attachmentId);
      } else if (cacheUri[attachmentId]?.uri && !cacheUri[attachmentId].loading) {
        setAttachmentUri(cacheUri[attachmentId].uri);
      }
    }
  }, [attachmentId, fetchAsset]); // eslint-disable-line react-hooks/exhaustive-deps

  return { attachmentUri, refetch: (attachmentId: string) => fetchAsset(attachmentId) };
};

const useToken = () => {
  const { authToken } = useContext(AuthContext);

  return { authToken };
};

const useUser = () => {
  const { user } = useContext(AuthContext);

  return { user };
};

function useDidUpdateEffect(fn: () => void, inputs: any[]) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
  }, inputs); // eslint-disable-line react-hooks/exhaustive-deps
}

export const enum ViewIdType {
  INTERNAL = 'internal',
  FAVORITES = 'favorites',
  ALL = 'all',
  CUSTOM = 'custom',
}

const useViewIdFilter = (viewId: string, tenant: any) => {
  let additionalFilters = {};
  switch (viewId) {
    case ViewIdType.INTERNAL:
      additionalFilters = { companyType: 'internal' };
      break;
    case ViewIdType.FAVORITES:
      additionalFilters = { isFavorite: true };
      break;
    case ViewIdType.ALL:
      break;
    default:
      if (tenant) {
        additionalFilters = { lists: [`${viewId}`], tenantId: tenant.id };
      } else {
        additionalFilters = { lists: [`${viewId}`] };
      }
      break;
  }
  return additionalFilters;
};

const useTenantCompany = () => {
  const { tenantToken } = useContext(LocalStorageContext);
  const [result, setResult] = useState<any>({});

  useEffect(() => {
    if (tenantToken) {
      try {
        setResult(jwt_decode(tenantToken));
      } catch {
        console.error('Invalid tenant company');
      }
    }
  }, [tenantToken]);

  return result;
};

const useExternalUploadLink = () => {
  const [link, setLink] = useState('');

  useEffect(() => {
    fetch(`${config.REST_URI}/sas`)
      .then((res) => res.json())
      .then((res) => {
        setLink(res.sas);
      });
  }, []);

  return link;
};

const useGeolocation = (): [Coordinates | undefined, boolean, Dispatch<SetStateAction<boolean>>] => {
  const [fetchData, setFetchData] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [position, setPosition] = useState<Coordinates | undefined>();
  useEffect(() => {
    if (fetchData) {
      setLoadingFetch(true);
      navigator.geolocation.getCurrentPosition(async (position: Position) => {
        setPosition(position.coords);
        setLoadingFetch(false);
      });
    }
  }, [fetchData]);

  return [position, loadingFetch, setFetchData];
};

const useGetReportID = (chart: string, page: number, dashboard: boolean) => {
  const [reportName, setReportName] = useState(chart);
  const [reportParam, setReportParam] = useState('');

  useEffect(() => {
    if (chart === 'Internal Companies' || chart === 'Suppliers') {
      !dashboard && navigate(`/reports/${chart}/1`);
      setReportParam('Internal Companies');
      return setReportName(ReportsTypes.INTERNAL_COMPANIES);
    } else if (chart === 'Projects') {
      !dashboard && navigate(`/reports/${chart}/1`);
      setReportParam('Projects');
      setReportName(ReportsTypes.PROEJCTS);
    } else if (chart === 'Total Spend' || chart === 'Spent') {
      !dashboard && navigate(`/reports/${chart}/1`);
      setReportParam('Total Spend');
      return setReportName(ReportsTypes.TOTAL_SPENT);
    } else if (chart === 'Top Industries') {
      !dashboard && navigate(`/reports/${chart}/1`);
      setReportParam('Top Industries');
      return setReportName(ReportsTypes.TOP_INDUSTRIES);
    } else if (chart === 'Ownership') {
      !dashboard && navigate(`/reports/${chart}/1`);
      setReportParam('Ownership');
      return setReportName(ReportsTypes.OWNERSHIP);
    } else if (chart === 'Unused Companies') {
      setReportParam('Unused Companies');
      !dashboard && navigate(`/reports/${chart}/${page}`);
      return setReportName(ReportsTypes.UNUSED_COMPANIES);
    }
  }, [chart]);

  return { reportName, reportParam };
};

interface ActivityLogParams {
  userId?: string;
  page?: number;
  limit?: number;
  notUserId?: string;
}

const useActivityLog = ({ userId, page, limit, notUserId }: ActivityLogParams) => {
  const [logs, setLogs] = useState<any>([]);

  const { loading } = useQuery(ACTIVITY_LOG_GQL, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-only',
    variables: {
      notUserId,
      userId,
      page,
      limit,
    },
    onCompleted(data) {
      if (data?.searchEvents?.results) {
        setLogs(
          [...(data?.searchEvents?.results ?? [])].sort((a: any, b: any) => {
            const aDate: any = new Date(a?.created);
            const bDate: any = new Date(b?.created);
            return bDate - aDate;
          }) ?? []
        );
      }
    },
  });

  return { logs, loading };
};

const useGetProjects = (userId: string | null, page: number | null, limit: number | null, statusIn: string | null) => {
  const [projects, setProjects] = useState([]);
  const [count, setCount] = useState(0);
  const { loading } = useQuery(PROJECTS_GQL, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-only',
    variables: {
      userId,
      page,
      limit,
      statusIn,
    },
    onCompleted(data) {
      setProjects(data?.searchAllProjects?.results ?? []);
      setCount(data?.searchAllProjects?.count ?? 0);
    },
  });

  return { projects, count, loading };
};

const useGetDashboardData = (timePeriodFilter: string, granularityFilter: string, chart: string) => {
  const [chartData, setChartData] = useState([]);
  const [count, setCount] = useState(0);
  const [prevYearCount, setPrevYearCount] = useState(0);
  const query =
    chart === 'Suppliers'
      ? SEARCH_INTERNAL_COMPANIES_DASHBOARD
      : chart === 'Projects'
        ? SEARCH_PROJECTS_DASHBOARD
        : SEARCH_TOTALSPEND_DASHBOARD;

  const { loading } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      timePeriodFilter,
      granularityFilter,
    },
    onCompleted(data) {
      setChartData(
        chart === 'Suppliers'
          ? data?.getInternalCompaniesDashboard?.results
          : chart === 'Projects'
            ? data?.getProjectsDashboard?.results
            : (data?.getTotalSpendDashboard?.results ?? [])
      );

      setCount(
        chart === 'Suppliers'
          ? data?.getInternalCompaniesDashboard?.count
          : chart === 'Projects'
            ? data?.getProjectsDashboard?.count
            : (data?.getTotalSpendDashboard?.count ?? 0)
      );
      setPrevYearCount(
        chart === 'Suppliers'
          ? data?.getInternalCompaniesDashboard?.checkPrevYear
          : chart === 'Projects'
            ? data?.getProjectsDashboard?.checkPrevYear
            : (data?.getTotalSpendDashboard?.checkPrevYear ?? 0)
      );
    },
  });

  return { chartData, loading, count, prevYearCount };
};

const useCheckDashboarData = () => {
  const [hasData, setHasData] = useState(true);
  const [currentSpent, setCurrentSpent] = useState(true);
  const [currentProject, setCurrentProject] = useState(true);
  const [currentSupplier, setCurrentSupplier] = useState(true);
  const [prevSpent, setPrevSpent] = useState(true);
  const [prevProject, setPrevProject] = useState(true);
  const [prevSupplier, setSupplier] = useState(true);
  const { data: internal, loading: loadingInternal } = useQuery(CHECK_INTERNAL_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setCurrentSupplier(data?.checkDataInternalDashboard?.currentYear > 0);
      setSupplier(data?.checkDataInternalDashboard?.currentYear > 0);
    },
  });

  const { data: projectReports, loading: loadingProject } = useQuery(CHECK_PROJECTS_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setCurrentProject(data?.checkDataProjectsDashboard?.currentYear > 0);
      setPrevProject(data?.checkDataProjectsDashboard?.currentYear > 0);
    },
  });

  const { data: spent, loading: loadingSpent } = useQuery(CHECK_TOTALSPENT_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setCurrentSpent(data?.checkDataSpentDashboard?.currentYear > 0);
      setPrevSpent(data?.checkDataSpentDashboard?.currentYear > 0);
    },
  });

  useEffect(() => {
    if (
      internal?.checkDataInternalDashboard?.hasData === false &&
      spent?.checkDataSpentDashboard?.hasData === false &&
      projectReports?.checkDataProjectsDashboard?.hasData === false
    ) {
      setHasData(false);
    }
  }, [loadingProject, loadingInternal, loadingSpent]);

  return { hasData, currentSpent, currentProject, currentSupplier, prevSpent, prevProject, prevSupplier };
};

const useJurisdictionOfIncorporationParts = () => {
  const dispatch = useDispatch();
  const [countryAndSub, setCountryAndSub] = useState({
    country: '',
    countrySub: '',
  });

  const jurisdictionOfIncorporation = useSelector(
    (state: { company: CompanyUpdateState }) => state.company.jurisdictionOfIncorporation
  );

  const getCountryAndSub = (jurisdictionOfIncorporation: string) => {
    const [country, countrySub] = jurisdictionOfIncorporation.split('-');
    return { country, countrySub };
  };

  useEffect(() => {
    if (jurisdictionOfIncorporation) {
      setCountryAndSub(getCountryAndSub(jurisdictionOfIncorporation));
    }
  }, [jurisdictionOfIncorporation]);

  const updateJurisdictionOfIncorporation = (country: string, countrySub: string) => {
    const jurisdictionOfIncorporationArray = [];
    if (country) jurisdictionOfIncorporationArray[0] = country === 'Country codes' ? '' : country;
    if (countrySub) jurisdictionOfIncorporationArray[1] = countrySub === 'Subdivision codes' ? '' : countrySub;
    const jurisdictionOfIncorporation =
      jurisdictionOfIncorporationArray[1] === '' ? country : jurisdictionOfIncorporationArray.join('-');
    setCountryAndSub({ country, countrySub });
    dispatch(setJurisdictionOfIncorporation(jurisdictionOfIncorporation.toUpperCase()));
  };

  return {
    country: countryAndSub.country || '',
    countrySub: countryAndSub.countrySub || '',
    setJurisdiction: updateJurisdictionOfIncorporation,
  };
};

const handleErrorFromAlerts = ({
  errors,
  enqueueSnackbar,
  showErros = true,
}: {
  errors: any;
  enqueueSnackbar: any;
  showErros?: boolean;
}) => {
  const fromErros = Object.keys(errors);
  if (!showErros) return !!fromErros.length;
  if (fromErros.length) {
    let message = 'Please check the following fields:';
    fromErros.forEach((key) => {
      message = `${message} ${key}` + (fromErros.indexOf(key) === fromErros.length - 1 ? '.' : ',');
    });
    enqueueSnackbar(message, { status: 'warning' });
    return true;
  }

  return false;
};

const cleanAndFormatString = (str: string) => {
  const trimmedStr = str.replace(/^\s+/g, '');
  const formattedStr = trimmedStr.replace(/\s\s+/g, ' ');
  return formattedStr;
};

const numberInputSanitizer = (value: string) => {
  if (!value) return;
  const sanitizedValue = value.replace(/\D/g, '');
  if (sanitizedValue === '') return sanitizedValue;
  return parseInt(sanitizedValue, 10);
};

const handlePageErrorOnList = ({ data, route, path }: { data: any; route: string; path: string }) => {
  const results = data[path]?.results ?? [];
  const count = data[path]?.count ?? 0;
  if (results.length === 0 && count > 0) {
    navigate(route);
  }
};

const useDynamicMarginLeft = (initialMargin: string) => {
  const [marginLeft, setMarginLeft] = useState(initialMargin);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const newMarginLeft = Math.floor((windowWidth / 100) * 21.7);
      setMarginLeft(`${newMarginLeft}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return marginLeft;
};

export {
  handlePageErrorOnList,
  useExternalUploadLink,
  useTenantCompany,
  useTenantContext,
  useToken,
  useUser,
  useErrorTranslation,
  useTimeout,
  useStimulusToast,
  useAssetUri,
  useLazyAssetUri,
  useProjectAttachmentUri,
  useCompanyAttachmentUri,
  useDidUpdateEffect,
  useViewIdFilter,
  useGeolocation,
  useGetReportID,
  useActivityLog,
  useGetProjects,
  useGetDashboardData,
  useCheckDashboarData,
  useJurisdictionOfIncorporationParts,
  handleErrorFromAlerts,
  cleanAndFormatString,
  numberInputSanitizer,
  useDynamicMarginLeft,
};
