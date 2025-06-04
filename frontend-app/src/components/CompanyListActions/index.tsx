import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import * as R from 'ramda';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TCRMutations from '../../graphql/Mutations/TCRMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { GeneralTypeList } from '../../graphql/types';
import CompanyAddActionPanel from '../CompanyAddActionPanel';
import MessageComponent from '../GenericComponents/MessageComponent';
const { DISCOVER_COMPANIES_GQL, COUNT_COMPANIES_LIST } = CompanyQueries;
const { CHANGE_FAVORITE_SETTING_GQL } = TCRMutations;

const CompanyListActions = (props: {
  company: any;
  isChecked: boolean;
  onCheckboxChange: (val: boolean) => void;
  limit: number;
  page: number;
  direction: string;
  orderBy: string;
  additionalFilters: any;
  filters: any;
}) => {
  const { limit, page, additionalFilters, company, isChecked, onCheckboxChange, orderBy, direction, filters } = props;
  const toast = useToast();
  const refModal: any = useRef();
  const toastIdRef: any = useRef();
  const { t } = useTranslation();
  const { onOpen, onClose, isOpen } = useDisclosure();
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (refModal?.current && !refModal?.current?.contains(event.target)) {
        // Aquí puedes cambiar el estado del componente
        onClose();
      }
    }
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [refModal]);

  const [changeFavoriteSetting, { loading: loadingFavorite }] = useMutation(CHANGE_FAVORITE_SETTING_GQL, {
    update: async (cache, data) => {
      const {
        data: { updateTenantCompanyRelation },
      } = data;
      const { id: companyId } = company;
      const clonedList = (await R.clone(
        cache.readQuery({
          query: DISCOVER_COMPANIES_GQL,
          variables: {
            ...additionalFilters,
            limit,
            page,
            orderBy,
            direction,
            ...Object.keys(filters).reduce(
              (acc, curr) => ({
                ...acc,
                ...(!!filters[curr] && { [curr]: filters[curr] }),
              }),
              {}
            ),
          },
        })
      )) as any;

      if (clonedList) {
        const companiesUpdated = clonedList.discoverCompanies.results.map((company: any) => {
          if (company.id === companyId) {
            company.tenantCompanyRelation = {
              ...company.tenantCompanyRelation,
              isFavorite: updateTenantCompanyRelation.isFavorite,
            };
            return company;
          } else {
            return company;
          }
        });

        clonedList.discoverCompanies.results = companiesUpdated;

        cache.writeQuery({
          query: DISCOVER_COMPANIES_GQL,
          variables: {
            ...additionalFilters,
            limit,
            page,
            orderBy,
            direction,
            ...Object.keys(filters).reduce(
              (acc, curr) => ({
                ...acc,
                ...(!!filters[curr] && { [curr]: filters[curr] }),
              }),
              {}
            ),
          },
          data: { ...clonedList },
        });
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
          ...Object.keys(filters).reduce(
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

  const toggleFavorite = (company: any) => {
    const { id, tenantCompanyRelation, legalBusinessName } = company;
    const variables = { id, isFavorite: !tenantCompanyRelation.isFavorite };

    changeFavoriteSetting({
      variables,
    }).then(({ data }: any) => {
      if (!data.updateTenantCompanyRelation.errors) {
        toastIdRef.current = toast({
          render: () => (
            <MessageComponent
              actions={'favoriteList'}
              id={id.toString()}
              name={legalBusinessName}
              close={() => toast.close(toastIdRef.current)}
              isFavorite={data.updateTenantCompanyRelation.isFavorite}
            />
          ),
          id: data.updateTenantCompanyRelation.id,
        });
      }
    });
  };
  return (
    <Flex>
      <Center flex="1">
        <Box _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}>
          <Tooltip
            label={isChecked ? t('Remove') : t('Select')}
            bg="#fff"
            border="1px solid #E4E4E4"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
            boxSizing="border-box"
            color="#2A2A28"
          >
            <IconButton
              variant="simple"
              aria-label="add"
              size="sm"
              onClick={(e: any) => {
                e.stopPropagation();
                onCheckboxChange(!isChecked);
              }}
              icon={
                <Image
                  {...(isChecked && {
                    bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.75) 0.03%, rgba(146, 214, 193, 0.75) 99.97%), #FFFFFF',
                    bgPosition: 'center',
                    bgRepeat: 'no-repeat',
                    bgSize: '10px 10px',
                  })}
                  width="14px"
                  src={`/icons/checkbox_${isChecked ? 'checked' : 'unchecked'}.svg`}
                />
              }
            />
          </Tooltip>
        </Box>
      </Center>
      <Center flex="1">
        <Box _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}>
          <Tooltip
            label={company.tenantCompanyRelation?.isFavorite ? t('Remove from Favorites') : t('Add to Favorites')}
            bg="#fff"
            border="1px solid #E4E4E4"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
            boxSizing="border-box"
            color="#2A2A28"
          >
            <IconButton
              isLoading={loadingFavorite}
              size="sm"
              onClick={(e: any) => {
                e.stopPropagation();
                toggleFavorite(company);
              }}
              variant="simple"
              aria-label="add"
              icon={
                <Image
                  width="14px"
                  src={`/icons/star_${company.tenantCompanyRelation?.isFavorite ? 'filled' : 'outlined'}.svg`}
                />
              }
            />
          </Tooltip>
        </Box>
      </Center>
      <Center flex="1" ref={refModal}>
        <Box>
          <Popover placement="right-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose} closeOnBlur={false}>
            <PopoverTrigger>
              <Button
                as={IconButton}
                aria-label="add"
                size="sm"
                icon={<Image width="14px" src={`/icons/plus.svg`} />}
                bg="transparent"
                _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
                onClick={onOpen}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                maxH="500px"
                overflowY="scroll"
                p="0"
                width="200px"
                borderRadius="0"
                border="1px solid #E4E4E4"
                borderColor="#E4E4E4"
                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
              >
                <PopoverArrow />
                <PopoverBody p="0">{isOpen && <CompanyAddActionPanel company={company} />}</PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Box>
      </Center>
    </Flex>
  );
};

export default CompanyListActions;
