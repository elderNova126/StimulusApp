import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BiListCheck, BiListMinus, BiListOl } from 'react-icons/bi';
import { SharedListStatus } from '../../graphql/Models/SharedList';
import { useUser } from '../../hooks';
import { capitalizeFirstLetter } from '../../utils/dataMapper';
import { EventLog, MetaEvent } from './types';

const SharedListLogItem: FC<{ entityId: string; event: EventLog; variant: 0 | 1; dashboard?: boolean }> = (props) => {
  const { event, dashboard } = props;
  const { t } = useTranslation();
  const {
    user: { sub: userId },
  } = useUser();

  const selectIcontByStatus = (status: string | undefined) => {
    if (!status) return <BiListOl size={'30'} />;

    const iconComponentList = {
      [SharedListStatus.PENDING]: <BiListOl size={'30px'} />,
      [SharedListStatus.APPROVED]: (
        <Box ml="3px" mr="-2px">
          <BiListCheck size={'30px'} />
        </Box>
      ),
      [SharedListStatus.DECLINED]: <BiListMinus size={'30'} />,
      [SharedListStatus.DELETED]: <BiListMinus size={'30'} />,
    };
    return iconComponentList[status as SharedListStatus];
  };
  const IcontEvent = selectIcontByStatus(event?.meta?.status);

  const selectTexttByStatus = (status: string | undefined, body: string, meta: MetaEvent) => {
    if (!status) return t('Shared list event not found');
    const { listName } = meta;
    const bodyToArra = body.split(' ');

    const userInvitatedNameList = {
      [SharedListStatus.PENDING]: `${bodyToArra[bodyToArra.length - 2]} ${bodyToArra[bodyToArra.length - 1]}`,
      // [SharedListStatus.PENDING]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
      [SharedListStatus.APPROVED]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
      [SharedListStatus.DECLINED]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
      [SharedListStatus.DELETED]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
    };
    const ownerInvitatedNameList: any = {
      [SharedListStatus.PENDING]: `${bodyToArra[0]} ${bodyToArra[1]}`,
    };

    const userInvitatedName = userInvitatedNameList[status as SharedListStatus];
    const ownerInvitatedName: any = userId === event.userId ? 'You' : ownerInvitatedNameList[status];
    const textList = {
      [SharedListStatus.PENDING]: `${capitalizeFirstLetter(ownerInvitatedName)} invited ${capitalizeFirstLetter(
        userInvitatedName
      )} to ${listName} list`,
      [SharedListStatus.APPROVED]: ` ${t(
        `${capitalizeFirstLetter(userInvitatedName)} accepted the invite to`
      )} ${listName} ${t('List')}`,
      [SharedListStatus.DECLINED]: ` ${capitalizeFirstLetter(userInvitatedName)} ${t(
        'declined the invite to'
      )}  ${listName} ${t('List')}`,
      [SharedListStatus.DELETED]: ` ${capitalizeFirstLetter(userInvitatedName)} ${t(
        'deleted the invite to'
      )} ${listName} ${t('List')}`,
    };
    return textList[status as SharedListStatus];
  };
  const textEvent = selectTexttByStatus(event?.meta?.status, event?.body as string, event?.meta as MetaEvent);
  return (
    <Flex alignItems="flex-start" w="100%" _hover={{ bg: '#F6F6F6', borderRadius: '4px' }}>
      <>
        <Box p="2" ml="-5px">
          {IcontEvent}
        </Box>
        <Stack flex="1" spacing={3} p="2">
          <Stack spacing={0}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Text ml="-15px" as="h4" textStyle="h4" mt="5px">
                {textEvent}
              </Text>
            </Stack>
            {dashboard === false && <Text textStyle="filterFieldHeading">{t('Shared list')}</Text>}
          </Stack>
        </Stack>
      </>
    </Flex>
  );
};

const SharedListLog: FC<{ entityId: string; events: EventLog[]; variant: 0 | 1 }> = (props) => {
  const { entityId, events } = props;

  return (
    <Stack>
      {events.map((event) => (
        <SharedListLogItem key={event.id} entityId={entityId} event={event} variant={0} />
      ))}
    </Stack>
  );
};

export default SharedListLog;
