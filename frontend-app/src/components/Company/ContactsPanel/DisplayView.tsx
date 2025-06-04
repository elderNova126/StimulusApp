import { ArrowUpDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../GenericComponents';
import { Company, Contact } from '../company.types';
import { CompanyAccordion, CompanyProfileDivider, FakeRightBorder } from '../shared';
import ContactItemRow from './ContactItemRow';

const DisplayView = (props: { company: Company }) => {
  const { t } = useTranslation();
  const { company } = props;
  const contacts = company.contacts?.results ?? [];
  const { length: count } = contacts;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const indexOfLastPost = page * limit;
  const indexOfFirstPost = indexOfLastPost - limit;
  const currentContacts = contacts.slice(indexOfFirstPost, indexOfLastPost);

  const [contactsSorted, setContactsSorted] = useState(currentContacts);
  const [sortType, setSortType] = useState('firstName');
  const [order, setOrder] = useState<any>(false);

  useEffect(() => {
    setContactsSorted(currentContacts);
  }, [company, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sortArray = (type: any) => {
      switch (type) {
        case 'city':
          return setContactsSorted(
            [...currentContacts].sort((a, b) => {
              const valueA: string = a.city ?? '';
              const valueB: string = b.city ?? '';
              return order === false ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            })
          );
        case 'jobTitle':
          return setContactsSorted(
            [...currentContacts].sort((a: any, b: any) => {
              return order === false
                ? (a.jobTitle ?? '').localeCompare(b.jobTitle ?? '')
                : (b.jobTitle ?? '').localeCompare(a.jobTitle ?? '');
            })
          );
        case 'contact':
          return setContactsSorted(
            [...currentContacts].sort((a: any, b: any) => {
              const result = a.email ? a.email.localeCompare(b.email ?? '') : 1;
              const resultReverse = (b.email ?? '').localeCompare(a.email ?? '');
              return order === false
                ? result !== 0
                  ? result
                  : (a.phone ?? '').localeCompare(b.phone ?? '')
                : resultReverse !== 0
                  ? resultReverse
                  : (b.phone ?? '').localeCompare(a.phone ?? '');
            })
          );
        case 'firstName':
          return setContactsSorted(
            [...currentContacts].sort((a: any, b: any) => {
              const result = a.firstName ? a.firstName.localeCompare(b.firstName) : 1;
              const resultReverse = (b.firstName ?? '').localeCompare(a.firstName ?? '');
              return order === false
                ? result !== 0
                  ? result
                  : (a.lastName ?? '').localeCompare(b.lastName ?? '')
                : resultReverse !== 0
                  ? resultReverse
                  : (b.lastName ?? '').localeCompare(a.lastName ?? '');
            })
          );
        case 'type':
          return setContactsSorted(
            [...currentContacts].sort((a, b) => {
              const valueA: string = a.type ?? '';
              const valueB: string = b.type ?? '';
              return order === false ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            })
          );
        default:
          return currentContacts;
      }
    };
    sortArray(sortType);
  }, [sortType, order, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOrder(false);
  }, [sortType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Pagination
        count={contacts?.length ?? 0}
        rowsPerPage={limit}
        page={page}
        onChangePage={setPage}
        onChangeRowsPerPage={setLimit}
        hideRowsPerPage={true}
      />
      <Box>
        <CompanyProfileDivider marginTop="5px" />
      </Box>
      <Flex>
        <Box w="48px" position="relative">
          <FakeRightBorder />
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('firstName');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
            {t('NAME')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'firstName' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('contact');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
            {t('CONTACT')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'contact' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('jobTitle');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
            {t('POSITION')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'jobTitle' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('city');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
            {t('CITY')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'city' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
        <Box
          flex={1}
          onClick={() => {
            setSortType('type');
            setOrder(!order);
          }}
        >
          <Text as="h5" textStyle="h5" p="14px" cursor={'pointer'} _hover={{ textDecoration: 'underline' }}>
            {t('Contact Type')}
            <ArrowUpDownIcon
              fontSize="10px"
              marginLeft="10px"
              marginBottom="3px"
              visibility={sortType === 'type' ? 'visible' : 'hidden'}
            />
          </Text>
        </Box>
      </Flex>
      {count > 0 ? (
        <CompanyAccordion allowMultiple maxH="70vh" overflow="auto">
          {contactsSorted.map((contact: Contact) => (
            <ContactItemRow key={contact.id} contact={contact} />
          ))}
        </CompanyAccordion>
      ) : (
        <Text>{t('No Contacts found.')}</Text>
      )}
    </Box>
  );
};

export default DisplayView;
