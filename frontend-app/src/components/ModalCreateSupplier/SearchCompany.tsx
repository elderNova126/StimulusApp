import {
  ModalFooter,
  ModalBody,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  Input,
  Stack,
  List,
  ListItem,
  Divider,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Search2Icon } from '@chakra-ui/icons';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useLazyQuery } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';
import { CompanyAvatar } from '../GenericComponents';
import { useDispatch } from 'react-redux';
import { applyFilters, setFilterSearch, setQuery } from '../../stores/features';
import { navigate } from '@reach/router';
import { Company } from '../Company/company.types';
import { FormCompanyContext } from '../../hooks/companyForms/companyForm.provider';
const { SEARCH_COMPANIES_BY_NAME_TAXID } = CompanyQueries;
const SearchCompany = (props: {
  setCreateCompany: (data: boolean) => void;
  setLegalBusinessName: (data: string) => void;
  setTaxId: (data: string) => void;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const { setCreateCompany, setLegalBusinessName, setTaxId, onClose } = props;
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Company | any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [count, setCount] = useState(0);

  const { formMethods } = useContext(FormCompanyContext)!;
  const { clearErrors } = formMethods;

  useEffect(() => {
    clearErrors();
  }, []);

  const [searchCompanies, { loading: loadingCompanies }] = useLazyQuery(SEARCH_COMPANIES_BY_NAME_TAXID, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      if (data?.getCompaniesByTaxIdAndName && searchValue !== '') {
        setCompanies(data?.getCompaniesByTaxIdAndName?.results);
        setCount(data?.getCompaniesByTaxIdAndName?.count);
      } else {
        setCompanies([]);
      }
    },
  });
  useEffect(() => {
    if (searchValue !== '') {
      setTimeout(() => {
        searchCompanies({ variables: { query: searchValue } });
      }, 200);
    }
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchValue === '') {
      setCompanies([]);
      setCount(0);
      setTaxId('');
      setLegalBusinessName('');
    }
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTaxIdAndNames = () => {
    if (count === 0) {
      const regex = /^[A-Za-z]{2}:[\s\S]*\d/;
      if (regex.test(searchValue)) {
        setTaxId(searchValue);
      } else if (searchValue.length > 0) {
        setLegalBusinessName(searchValue);
      }
    }
  };

  return (
    <>
      <ModalBody>
        <Text fontSize="12px" fontWeight={600} mb="10px">
          {t('Name or Tax ID')}
        </Text>
        <InputGroup bg="#FFFFFF" border={'1px solid #848484'} borderRadius="4px">
          <InputLeftElement
            pointerEvents="none"
            color="#2A2A28A6"
            fontSize="11px"
            children={<Search2Icon mb="8px" />}
          />
          <Input onChange={(e) => setSearchValue(e.target.value)} h="30px" type="text" border="none" />
        </InputGroup>
        {loadingCompanies ? (
          <Spinner mx="160px" mt="20px" color="green" size="xl" />
        ) : (
          <Stack mt="10px">
            {count > 0 ? (
              <Text color="#666666" fontWeight={400} fontSize="12px">
                {t('The following companies currently exist in our system:')}
              </Text>
            ) : searchValue ? (
              <Text color="#666666" fontWeight={400} fontSize="12px" mt="44px">
                {t('No matches for this company currently exist in our system.')}
              </Text>
            ) : null}
            <List maxH="205px" overflowY="scroll">
              {companies?.map((company: any, index: number) => {
                return (
                  <>
                    {' '}
                    {index === 0 && <Divider orientation="horizontal" borderColor="#D4D4D4" />}
                    <ListItem p="6px" _hover={{ bg: 'white', transition: '0.3s' }} display="flex">
                      <CompanyAvatar
                        createSupplier={true}
                        companyId={company.id}
                        w="38px"
                        h="38px"
                        marginRight="10px"
                        mt="5px"
                      />
                      <Box mt="5px">
                        <Text
                          onClick={() => navigate(`/company/${company.id}`)}
                          cursor="pointer"
                          _hover={{ textDecoration: 'underline' }}
                          fontWeight={600}
                          fontSize="12px"
                        >
                          {company.legalBusinessName}
                        </Text>
                        <Text fontWeight={400} fontSize="12px">
                          {company.taxIdNo}
                        </Text>
                      </Box>
                    </ListItem>
                    <Divider orientation="horizontal" borderColor="#D4D4D4" />
                  </>
                );
              })}
            </List>
            {count > 6 && (
              <Text
                onClick={() => {
                  dispatch(setQuery(searchValue));
                  dispatch(setFilterSearch('taxIdAndLegalName'));
                  dispatch(applyFilters());
                  return onClose();
                }}
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                {t('View more')}
              </Text>
            )}
            {count > 0 && (
              <Text color="#666666" fontWeight={400} fontSize="12px">
                {t('Not looking for any of the above companies?')}
              </Text>
            )}
          </Stack>
        )}
      </ModalBody>
      <ModalFooter border="0" justifyContent="start">
        <Button
          onClick={() => {
            handleTaxIdAndNames();
            return setCreateCompany(true);
          }}
          bg="#12814B"
          color="white"
          fontSize="13px"
          h="30px"
          w="170px"
          mr={3}
          disabled={!searchValue || (count === 1 && companies?.[0]?.taxIdNo === searchValue)}
        >
          {t('Create New Company')}
        </Button>
      </ModalFooter>
    </>
  );
};
export default SearchCompany;
