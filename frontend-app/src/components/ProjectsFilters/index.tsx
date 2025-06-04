import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  resetFilter,
  setArchived,
  setNotArchived,
  setSearchAccessType,
  setSearchByStatuses,
  setSearchByTitle,
  setSearchEndDate,
  setSearchStartDate,
} from '../../stores/features/projects';
import { Checkbox } from '../GenericComponents';
import { flexTitles } from './styles';
import StimButton from '../ReusableComponents/Button';

export enum ProjectStatuses {
  NEW = 'New',
  OPEN = 'Open',
  INREVIEW = 'INREVIEW',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'Completed',
  ONHOLD = 'On-Hold',
  CANCELED = 'Canceled',
}

const HOME_PAGE_PROJECT = '1';

interface Props {
  triggerSearchProjects: () => void;
  title: string;
  statuses: string[];
  archived: boolean;
  notArchived: boolean;
  startDate: string;
  endDate: string;
  accessType: string;
}

const ProjectsListFilters: FC<Props> = (props) => {
  const { triggerSearchProjects, title, statuses, archived, startDate, endDate, accessType } = props;
  const [searchName, setSearchName] = useState(title ?? '');
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchByStatuses(statuses));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (title === '') {
      setSearchName('');
      triggerSearchProjects();
    }
  }, [title]); // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <Box w="35%" p="10px" pt="5" ml="4rem">
      <Flex flexDir="column" h="100%">
        <Text as="h3" textStyle="h3">
          {t('Search')}
        </Text>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerSearchProjects();
          }}
        >
          <InputGroup mt="1rem" w="100%">
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" mb="5px" />} />
            <Input
              maxH="34px"
              fontSize="14px"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              type="text"
              placeholder="Search a project"
            />
            <InputRightElement
              width="4.6rem"
              children={
                <StimButton
                  borderLeftRadius="0"
                  mb="6px"
                  maxH="34px"
                  variant="stimPrimary"
                  type="submit"
                  onClick={() => {
                    navigate(HOME_PAGE_PROJECT);
                    dispatch(setSearchByTitle(searchName));
                    return triggerSearchProjects();
                  }}
                >
                  {t('Search')}
                </StimButton>
              }
            />
          </InputGroup>
        </form>
        <Flex mt="50px" flexDir="column">
          <Flex sx={flexTitles}>
            <Text as="h3" textStyle="h3">
              {t('Filter')}
            </Text>
            <Text
              textStyle="textLink"
              onClick={() => {
                navigate(HOME_PAGE_PROJECT);
                return dispatch(resetFilter());
              }}
            >
              {t('Reset filters')}
            </Text>
          </Flex>
          <Text mt="20px" as="h5" textStyle="h5" color="#000">
            {t('Status')}
          </Text>
          <List m="1rem 0 1rem" spacing={4}>
            {Object.values(ProjectStatuses).map((status) => {
              return (
                <ListItem
                  key={status}
                  cursor="pointer"
                  onClick={() => {
                    navigate(HOME_PAGE_PROJECT);
                    if (statuses?.indexOf(status) > -1) {
                      return dispatch(setSearchByStatuses(statuses.filter((s: string) => s !== status)));
                    } else {
                      return dispatch(setSearchByStatuses([...statuses, status]));
                    }
                  }}
                  display="flex"
                >
                  <Box mt="4px">
                    <Checkbox width="14px" height="14px" checked={statuses.indexOf(status.toString()) > -1} />
                  </Box>
                  <Text ml=".4rem" textStyle="body">
                    {t(status === 'INPROGRESS' ? 'In-Progress' : status === 'INREVIEW' ? 'Review' : status.toString())}
                  </Text>
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <Flex justifyContent="space-between" flexDir="column">
            <Flex
              onClick={() => {
                navigate(HOME_PAGE_PROJECT);
                dispatch(setNotArchived(!archived));
                dispatch(setArchived(!archived));
              }}
              mt="1rem"
              ml=".2rem"
              flexDir="row"
              cursor="pointer"
            >
              <Box mt="4px" mr=".4rem">
                <Checkbox width="14px" height="14px" checked={archived} />
              </Box>
              <Text textStyle="body">{t('Show Archived')}</Text>
            </Flex>
          </Flex>
        </Flex>

        <Text mt="1.5rem" as="h6" textStyle="h6" color="#000">
          {t('Date')}
        </Text>
        <Flex w="70%" alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
          <Input
            value={startDate}
            type="date"
            onChange={(e) => {
              navigate(HOME_PAGE_PROJECT);
              return dispatch(setSearchStartDate(e.target.value));
            }}
            bg="#fff"
            size="sm"
            borderRadius="4px"
            flex="1"
            border="1px solid #848484"
            placeholder="Start"
          />
          <Divider w="3" m="1" />
          <Input
            value={endDate}
            type="date"
            onChange={(e) => {
              navigate(HOME_PAGE_PROJECT);
              return dispatch(setSearchEndDate(e.target.value));
            }}
            bg="#fff"
            size="sm"
            borderRadius="4px"
            flex="1"
            border="1px solid #848484"
            placeholder="End"
          />
        </Flex>
        <Text mt="1rem" as="h6" textStyle="h6" color="#000">
          {t('Access Type')}
        </Text>
        <Box w="70%" alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
          <Select
            value={accessType}
            placeholder={`${t('Select')}...`}
            onChange={(e) => {
              navigate(HOME_PAGE_PROJECT);
              return dispatch(setSearchAccessType(e.target.value));
            }}
            fontSize="13px"
            color="grey"
          >
            <option value="owner">{t('Owner')}</option>
            <option value="collaborator">{t('Collaborator')}</option>
          </Select>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProjectsListFilters;
