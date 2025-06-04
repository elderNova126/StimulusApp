import { useQuery, useLazyQuery } from '@apollo/client';
import { Box, Flex, Text, Stack } from '@chakra-ui/layout';
import { CircularProgress } from '@chakra-ui/progress';
import { FC, useState, useEffect } from 'react';
import UserQueries from '../../graphql/Queries/UserQueries';
import { capitalizeFirstLetter } from '../../utils/dataMapper';
import { utcStringToLocalDateTime, utcStringToMoment, getDateAndHours } from '../../utils/date';
import { CompanyAvatar, UserAvatar } from '../GenericComponents';
import { eventComponents } from '../NotificationPopup';
import { EventLog } from './types';
import { Tooltip, Image } from '@chakra-ui/react';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { CompanyLink, ProjectLink } from '../EntityLink';
import { boxAvatar, flexLogItem, flexUserLogo, textUserName, tooltip } from './styles';

const { USER_PROFILE_GQL } = UserQueries;
const { GET_COMPANY_NAME } = CompanyQueries;

const getEventTime = (time: string, showAgoTime: boolean) => {
  return showAgoTime ? utcStringToMoment(time)?.fromNow() : utcStringToLocalDateTime(time);
};

const LogItem: FC<
  { event: EventLog } & { variant: 0 | 1 } & { dashboard?: boolean } & { tenant?: boolean } & {
    suggestionIcon?: boolean;
  } & { suggestionIndex?: number }
> = (props) => {
  const { event, variant, dashboard, tenant } = props;
  const { loading: loadingUser, data: userData } = useQuery(USER_PROFILE_GQL, {
    variables: { externalAuthSystemId: event.userId },
    fetchPolicy: 'cache-first',
  });
  const [showAgoTime, setShowAgoTime] = useState(true);
  const user = userData?.userProfile;
  const userName = `${capitalizeFirstLetter(user?.givenName ?? '')} ${capitalizeFirstLetter(user?.surname ?? '')}`;
  const Component = eventComponents[event.code];
  const [getCompany, { data: dataCompany }] = useLazyQuery(GET_COMPANY_NAME, {
    variables: { id: event.entityId },
    fetchPolicy: 'cache-first',
  });
  const company = dataCompany?.searchCompanies?.results?.[0];

  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (
      event.code !== 'ADD_COMPANY_TO_PROJECT' &&
      event.code !== 'UPDATE_COMPANY_SETTINGS' &&
      event.code !== 'UPDATE_COMPANY_STATUS' &&
      event.code !== 'REMOVE_FROM_COMPANY_LIST' &&
      event.code !== 'UPDATE_COMPANY_TYPE' &&
      event.code !== 'ADD_TO_COMPANY_LIST' &&
      event.code !== 'SET_SUPPLIER_TIER_COMPANY' &&
      event.code !== 'UPDATE_COMPANY_EVALUATION' &&
      event.code !== 'CREATE_PROJECT' &&
      event.code !== 'CREATE_COMPANY' &&
      event.code !== 'UPDATE_PROJECT_COMPANIES' &&
      event.code !== 'EVALUATE_PROJECT_COMPANY' &&
      event.code !== 'CANCEL_PROJECT' &&
      event.code !== 'ARCHIVE_PROJECT' &&
      event.code !== 'UPDATE_PROJECT_STATUS'
    ) {
      setHide(true);
    }
  }, []);

  useEffect(() => {
    if (event.entityType === 'COMPANY') {
      getCompany();
    }
  }, []);

  return loadingUser ? (
    <CircularProgress size="12px" isIndeterminate color="green.400" />
  ) : !Component ? null : dashboard ? (
    <Tooltip sx={tooltip} placement="top-start" label={getDateAndHours(event.created)}>
      <Box _hover={{ bg: '#F6F6F6', borderRadius: '4px' }} my="8px">
        <Stack justifyContent="space-between" w={tenant ? '690px' : '100%'}>
          <Flex sx={flexLogItem}>
            {tenant && (
              <Flex sx={flexUserLogo}>
                <Box sx={boxAvatar}>{<UserAvatar size="xs" userId={event?.userId ?? ''} />}</Box>
                <Text sx={textUserName}>{userName}</Text>
              </Flex>
            )}
            <Flex {...(tenant && { mt: '-5px', fontSize: '12px' })}>
              <Component event={event} isAlert={false} dashboard={dashboard} tenant={tenant} />
            </Flex>
            {event.entityType === 'COMPANY' && tenant && (
              <>
                <Text
                  fontWeight="400"
                  color="#797978"
                  fontSize="12px"
                  fontStyle="italic"
                  fontFamily="poppins"
                  pr="2"
                  pl="1"
                  mx={event.code !== 'ADD_COMPANY_TO_PROJECT' ? '3px' : '1px'}
                >
                  {hide ? 'of' : null}
                </Text>
                {hide ? (
                  <Text
                    mt="-5px"
                    bg="#F1F1F1"
                    color="#2A2A28"
                    fontSize="14px"
                    fontFamily="poppins"
                    borderRadius="4px"
                    p="2px 8px"
                  >
                    <CompanyAvatar p="1px" mt="3px" marginRight="4px" size="2xs" companyId={event.entityId} />
                    <CompanyLink id={event.entityId} name={company?.legalBusinessName} dashboard={dashboard} />
                  </Text>
                ) : null}
              </>
            )}
            {event.entityType === 'PROJECT' && hide && tenant ? (
              <>
                <Text
                  fontWeight="400"
                  color="#797978"
                  fontSize="14px"
                  fontStyle="italic"
                  fontFamily="poppins"
                  pr="2"
                  mt="2px"
                  mx="8px"
                >
                  of
                </Text>
                <Flex p="3px 8px" borderRadius="4px" fontSize="14px" bg="#F1F1F1" color="#2A2A28">
                  <Image mr="5px" w="20px" src="/icons/suitcase_log.svg" />
                  <ProjectLink id={event.entityId} name={event.meta?.projectName as any} dashboard={dashboard} />
                </Flex>
              </>
            ) : null}
          </Flex>
        </Stack>
      </Box>
    </Tooltip>
  ) : (
    <Box>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Text fontWeight="400" color="#747473" fontStyle="italic" fontFamily="poppins" pr="2">
            {userName}
          </Text>
          <Component event={event} isAlert={false} company={company} />
        </Flex>
        <Box cursor="pointer" onClick={() => setShowAgoTime(!showAgoTime)}>
          {variant === 1 && getEventTime(event.created, showAgoTime)}
        </Box>
      </Flex>
    </Box>
  );
};

export default LogItem;
