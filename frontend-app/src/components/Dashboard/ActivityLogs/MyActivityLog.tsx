import { Stack, Text, MenuButton, Menu, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CompanyProfileDivider } from '../../Company/shared';
import { SwitchButton } from '../../GenericComponents';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import EventsList from '../../EventsList/EventsList';
import { EventLog } from '../../EventsList/types';
import { filterLogsToggle } from '../../../utils/dataMapper';
import NoResultsMyActivity from '../NoResults/NoResultsMyActivity';

const MyActivityLog = (props: { events: EventLog[]; loading: boolean }) => {
  const { t } = useTranslation();
  const { events, loading } = props;
  const [companies, setCompanies] = useState(true);
  const [projects, setProjects] = useState(true);
  const [lists, setLists] = useState(true);
  const [logs, setLogs] = useState<any>([]);

  useEffect(() => {
    setLogs(filterLogsToggle(events, companies, projects, lists));
  }, [companies, projects, lists, events]);

  useEffect(() => {
    setLogs(events);
  }, [events]);

  return (
    <Stack w="353px" border="1px solid #E4E4E4" h="365px" rounded="4px" mr="1px">
      <Stack isInline>
        <Text mt="15px" ml="15px" mr="165px" fontSize="16px" fontWeight="600">
          {t('My Activity')}
        </Text>
        <Stack>
          <Menu closeOnSelect={false}>
            <MenuButton mt="5px" bg="transparent" w="30px" h="30px" borderRadius="50%" _active={{ bg: '#92D6C160' }}>
              <Icon as={BsThreeDotsVertical} ml="auto" size="sm" />
            </MenuButton>
            <MenuList overflow="scroll" textOverflow="clip" maxHeight="50vh" border="1px solid #E4E4E4">
              <MenuItem
                icon={
                  <SwitchButton
                    onClick={(e: any) => e.stopPropagation()}
                    onChange={() => {
                      setCompanies(!companies);
                    }}
                    isChecked={companies}
                  />
                }
              >
                {t('COMPANIES')}
              </MenuItem>
              <MenuItem
                icon={
                  <SwitchButton
                    onClick={(e: any) => e.stopPropagation()}
                    onChange={() => {
                      setProjects(!projects);
                    }}
                    isChecked={projects}
                  />
                }
              >
                {t('PROJECTS')}
              </MenuItem>
              <MenuItem
                icon={
                  <SwitchButton
                    onClick={(e: any) => e.stopPropagation()}
                    onChange={() => {
                      setLists(!lists);
                    }}
                    isChecked={lists}
                  />
                }
              >
                {t('LISTS')}
              </MenuItem>
              <MenuItem mt="8px" mb="-8px">
                <Text
                  onClick={() => navigate('/user/account/myactivitylog')}
                  textStyle="textLink"
                  fontSize={'14px'}
                  fontWeight={400}
                  color="#2A2A28"
                >
                  {t('View Full Activity Log')}
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Stack>
      {events.length ? (
        <>
          <CompanyProfileDivider />
          <Stack p="5px" overflow={'auto'}>
            <EventsList notifications={logs} loading={loading} variant={'SIMPLELISTO'} dashboard={true} />
          </Stack>
        </>
      ) : (
        <NoResultsMyActivity />
      )}
    </Stack>
  );
};

export default MyActivityLog;
