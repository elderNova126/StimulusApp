import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import moment from 'moment';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getUTCDate } from '../../utils/date';
import { EventCategoryType } from '../../graphql/enums';
import { EventCode } from '../NotificationPopup';
import CompanyLog from './CompanyLog';
import ProjectLog from './ProjectLog';
import SharedListLog from './SharedListLog';
import { EventLog } from './types';
import LogItem from './LogItem';
import { EmojiObjectsOutlined } from '@material-ui/icons';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
  ListItem,
  useDisclosure,
} from '@chakra-ui/react';
import LoadingScreen from '../LoadingScreen';
const EventsList: FC<{
  notifications: any;
  loading: boolean;
  variant: 'DIVIDEDLIST' | 'SIMPLELISTO' | 'DASHBOARDLIST';
  dashboard?: boolean;
  tenant?: boolean;
}> = ({ notifications, loading, variant, dashboard, tenant }) => {
  const props = { notifications, loading, dashboard, tenant };
  return variant === 'DIVIDEDLIST' ? (
    <DividedEventsList {...props} />
  ) : variant === 'SIMPLELISTO' ? (
    <SimpleEventsList {...props} />
  ) : variant === 'DASHBOARDLIST' ? (
    <DashboardEventList {...props} />
  ) : null;
};

const SimpleEventsList: FC<{ notifications: any; loading: boolean; dashboard?: boolean }> = (props) => {
  const { notifications, loading, dashboard } = props;
  const { t } = useTranslation();
  const notificationComponents = useMemo(() => {
    const typeGroup = notifications.reduce((acc: any, event: any) => {
      acc[event.entityType] = acc[event.entityType] || {};
      acc[event.entityType][event.entityId] = [...(acc[event.entityType][event.entityId] || []), event];
      return acc;
    }, {});

    return Object.keys(typeGroup).reduce((acc: any, type: string) => {
      const Component =
        type === EventCategoryType.COMPANY
          ? CompanyLog
          : type === EventCategoryType.PROJECT
            ? ProjectLog
            : type === EventCategoryType.LIST
              ? SharedListLog
              : null;
      const Group = typeGroup[type];

      if (Component) {
        acc = acc.concat(
          Object.keys(Group).map((id) => (
            <Flex key={id} justifyContent="space-between" {...(dashboard && { ml: '5px' })}>
              <Component entityId={id} events={Group[id]} variant={1} dashboard={dashboard} />
              <Box />
            </Flex>
          ))
        );
      }

      return acc;
    }, []);
  }, [notifications]);

  return (
    <Box>
      {loading ? (
        <LoadingScreen />
      ) : notificationComponents.length > 0 ? (
        notificationComponents
      ) : (
        <Text textStyle="body" data-testid="no-notifications">
          {t('No events based on filters')}
        </Text>
      )}
    </Box>
  );
};

const DashboardEventList: FC<{ notifications: any; loading: boolean; dashboard?: boolean; tenant?: boolean }> = (
  props
) => {
  const { notifications, loading, dashboard, tenant } = props;
  const { t } = useTranslation();

  return (
    <Box h="400px">
      {loading ? (
        <LoadingScreen />
      ) : notifications?.length > 0 ? (
        <>
          {notifications.map((events: any, index: number) => {
            return (
              <LogItem
                key={events.id}
                event={events}
                variant={1}
                dashboard={dashboard}
                tenant={tenant}
                suggestionIcon={true}
                suggestionIndex={index}
              />
            );
          })}
        </>
      ) : (
        <Text textStyle="body">{t('No events based on filters')}</Text>
      )}
    </Box>
  );
};

const DividedEventsList: FC<{ notifications: any; loading: boolean }> = (props) => {
  const { notifications, loading } = props;
  const { t } = useTranslation();
  const notificationComponents = useMemo(() => {
    const notificationsTimeGroups = notifications
      .filter((event: any) => event?.code in EventCode)
      .reduce((acc: any, curr: any) => {
        const key = moment.utc(curr.created).startOf('day').toString();
        acc[key] = [...(acc[key] || []), curr];
        return acc;
      }, {});

    const eventLog = {
      [EventCategoryType.COMPANY]: CompanyLog,
      [EventCategoryType.PROJECT]: ProjectLog,
      [EventCategoryType.LIST]: SharedListLog,
    };

    const notificationGroups = Object.keys(notificationsTimeGroups).reduce((acc: any, time: string) => {
      acc[time] = notificationsTimeGroups[time].reduce((acc: any, event: EventLog) => {
        acc[event.entityType] = acc[event.entityType] || {};
        acc[event.entityType][event.entityId] = [...(acc[event.entityType][event.entityId] || []), event];
        return acc;
      }, {});

      return acc;
    }, {});

    return Object.keys(notificationGroups).reduce((acc: any[], time: string) => {
      const notificationGroup = Object.keys(notificationGroups[time]).reduce((acc: any, type: string) => {
        const Component = eventLog[type as EventCategoryType];

        const typeGroup = notificationGroups[time][type];

        return Component
          ? acc.concat(
              Object.keys(typeGroup).map((id) => (
                <Component key={id} entityId={id} events={typeGroup[id]} variant={0} />
              ))
            )
          : acc;
      }, []);

      if (notificationGroup.length) {
        acc.push(
          <Stack key={time}>
            <Flex alignItems="center">
              <Divider w="10px" borderColor="#2A2A2899" />
              <Text px="2" as="h3" textStyle="h3" color="#2A2A2899">
                {getUTCDate(time)}
              </Text>
              <Divider borderColor="#2A2A2899" />
            </Flex>

            <Box>{notificationGroup}</Box>
          </Stack>
        );
      }
      return acc;
    }, []);
  }, [notifications]);
  return (
    <Box>
      {loading ? (
        <LoadingScreen />
      ) : notificationComponents.length > 0 ? (
        notificationComponents
      ) : (
        <Text textStyle="body">{t('No events based on filters')}</Text>
      )}
    </Box>
  );
};

export const SuggestionModal = (props: { suggestion: { title: string; suggestions: string[] } }) => {
  const { suggestion } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Stack onClick={onOpen}>
        <EmojiObjectsOutlined style={{ fontSize: '1rem' }} cursor="pointer" />
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
        <ModalContent border="1px solid #E4E4E4" rounded="4px" boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)">
          <ModalHeader>AI Suggestions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="14px" fontWeight="800">
              {suggestion.title}
            </Text>
            <UnorderedList mt="6px">
              {suggestion.suggestions.map((suggestion) => (
                <ListItem fontSize="13px" p="2px">
                  {suggestion}
                </ListItem>
              ))}
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" size="sm" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventsList;
