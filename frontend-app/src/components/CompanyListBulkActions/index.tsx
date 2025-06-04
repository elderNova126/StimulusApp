import { useMutation } from '@apollo/client';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from '@chakra-ui/react';
import StarIcon from '@material-ui/icons/Star';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import TCRMutations from '../../graphql/Mutations/TCRMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { CompanyWithCheck } from '../Companies/List';
import CompanyAddActionPanel from '../CompanyAddActionPanel';
import { GeneralTypeList } from '../../graphql/types';
import { useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';
const { BULK_SET_COMPANY_TO_INTERNAL } = CompanyMutations;
const { BULK_CHANGE_FAVORITE_SETTING_GQL } = TCRMutations;
const { DISCOVER_COMPANIES_GQL, COUNT_COMPANIES_LIST } = CompanyQueries;

const CompanyListBulkActions = (props: {
  bulkSelection: any;
  limit?: number;
  page?: number;
  direction?: string;
  orderBy?: string;
  additionalFilters?: any;
  filters?: any;
  reports?: boolean;
  setBulk: (data: any) => void;
  setBulkComparison?: (data: any) => void;
}) => {
  const {
    bulkSelection,
    limit,
    page,
    additionalFilters,
    orderBy,
    direction,
    filters,
    reports,
    setBulk,
    setBulkComparison,
  } = props;
  const [bulkIdArray, setBulkIdArray] = useState<string[]>([]);
  const [bulkFav, setbulkFav] = useState<string[]>([]);
  const [bulkInte, setbulkinte] = useState<string[]>([]);
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (bulkSelection.length > 0) {
      const bulkInternalIds = bulkSelection
        .filter((company: CompanyWithCheck) => {
          return company.isInternal === false;
        })
        ?.map((id: CompanyWithCheck) => {
          return id.id;
        });
      setbulkinte(bulkInternalIds);

      const bulkFavIds = bulkSelection
        .filter((company: CompanyWithCheck) => {
          return company.isFavorite === false;
        })
        ?.map((id: CompanyWithCheck) => {
          return id.id;
        });
      setbulkFav(bulkFavIds);

      setBulkIdArray(
        bulkSelection.map((company: any) => {
          return company.id;
        })
      );
    }
    return;
  }, [bulkSelection]); // eslint-disable-line react-hooks/exhaustive-deps

  const [bulkSetCompaniesToInternal, { loading: loadingInternal }] = useMutation(BULK_SET_COMPANY_TO_INTERNAL, {
    update: () => {
      const counter = bulkSelection.length - bulkInte.length;
      const companiesAdded = bulkSelection.length - counter;
      const repeatedCompaniesMsg = `${counter} of the ${bulkSelection.length} selected companies ${
        counter === 1 ? 'was' : 'were'
      } already on this Internal List`;
      if (counter > 0) {
        enqueueSnackbar(repeatedCompaniesMsg, { status: 'warning' }, 'internalList');
      }
      if (companiesAdded >= 1) {
        enqueueSnackbar(null, { status: 'success' }, 'internalList', companiesAdded);
      }
      setbulkinte([]);
      setbulkFav([]);
      setBulkIdArray([]);
      setBulk([]);
      if (setBulkComparison) {
        setBulkComparison([]);
      }
    },
    refetchQueries: [
      {
        query: COUNT_COMPANIES_LIST,
        variables: {
          listType: GeneralTypeList.INTERNAL,
        },
      },
    ],
  });
  const [bulkSetFavoriteCompanies, { loading: loadingFavorites }] = useMutation(BULK_CHANGE_FAVORITE_SETTING_GQL, {
    update: () => {
      const counter = bulkSelection.length - bulkFav.length;
      const companiesAdded = bulkSelection.length - counter;
      const repeatedCompaniesMsg = `${counter} of the ${bulkSelection.length} selected companies ${
        counter === 1 ? 'was' : 'were'
      } already on this Favorite List`;
      if (counter > 0) {
        enqueueSnackbar(repeatedCompaniesMsg, { status: 'warning' }, 'favoriteList');
      }
      if (companiesAdded >= 1) {
        enqueueSnackbar(null, { status: 'success' }, 'favoriteList', companiesAdded);
      }
      setbulkinte([]);
      setbulkFav([]);
      setBulkIdArray([]);
      setBulk([]);
      if (setBulkComparison) {
        setBulkComparison([]);
      }
    },
    refetchQueries: [
      {
        query: DISCOVER_COMPANIES_GQL,
        variables: {
          limit,
          page,
          orderBy,
          direction,
          ...additionalFilters,
          ...Object.keys(filters ?? {}).reduce(
            (acc, curr) => ({
              ...acc,
              ...(!!filters[curr] && { [curr]: filters[curr] }),
            }),
            {}
          ),
        },
      },
      {
        query: COUNT_COMPANIES_LIST,
        variables: {
          listType: GeneralTypeList.FAVORITE,
        },
      },
    ],
  });

  const handleBulkInternal = (e: any) => {
    e.preventDefault();
    bulkSetCompaniesToInternal({ variables: { companyIds: bulkInte } });
  };

  const handleBulkFavorite = (e: any) => {
    e.preventDefault();
    bulkSetFavoriteCompanies({ variables: { companyIds: bulkFav, isFavorite: true } });
  };
  return (
    <Box w={reports ? '300px' : ''}>
      <Stack direction="row" spacing="8px" alignItems="center">
        <StimButton
          isLoading={loadingFavorites}
          onClick={handleBulkFavorite}
          leftIcon={<StarIcon style={{ fontSize: '8px' }} />}
          variant="stimOutline"
          size="stimSmall"
        >
          {t('Favorites')}
        </StimButton>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <StimButton leftIcon={<AddIcon fontSize="8px" />} variant="stimOutline" size="stimSmall">
              {t('Lists')}
            </StimButton>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              maxH="500px"
              overflowY="scroll"
              width="180px"
              p="2px"
              mb="5px"
              borderRadius="0"
              border="1px solid #E4E4E4"
              borderColor="#E4E4E4"
              boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
            >
              <PopoverArrow />
              <PopoverBody p="2px">
                <CompanyAddActionPanel
                  companyIds={bulkIdArray}
                  options={{ hideProjects: true }}
                  setBulk={setBulk}
                  setBulkComparison={setBulkComparison}
                />
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <StimButton leftIcon={<AddIcon fontSize="8px" />} variant="stimOutline" size="stimSmall">
              {t('Projects')}
            </StimButton>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              maxH="500px"
              overflowY="scroll"
              width="210px"
              p="2px"
              mb="5px"
              borderRadius="0"
              border="1px solid #E4E4E4"
              borderColor="#E4E4E4"
              boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
            >
              <PopoverArrow />
              <PopoverBody p="2px">
                <CompanyAddActionPanel
                  companyIds={bulkIdArray}
                  options={{ hideLists: true }}
                  setBulk={setBulk}
                  setBulkComparison={setBulkComparison}
                />
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        {reports === true ? null : (
          <StimButton
            isLoading={loadingInternal}
            leftIcon={<AddIcon fontSize="8px" />}
            variant="stimOutline"
            onClick={handleBulkInternal}
            size="stimSmall"
          >
            {t('Internal')}
          </StimButton>
        )}
      </Stack>
    </Box>
  );
};

export default CompanyListBulkActions;
