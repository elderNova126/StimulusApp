import { useQuery } from '@apollo/client';
import { Box, BoxProps, CircularProgress, Flex, Image, Stack, Text, Tooltip } from '@chakra-ui/react';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BiRightArrowAlt } from 'react-icons/bi';
import { SharedListStatus } from '../../graphql/Models/SharedList';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { capitalizeFirstLetter, getCompanyName, projectStatusMapper } from '../../utils/dataMapper';
import { fixNamesObj } from '../../utils/string';
import { CommonLink, CompanyLink, ListLink, ProjectLink } from '../EntityLink/index';
import { MetaEvent } from '../EventsList/types';
import { CompanyAvatar } from '../GenericComponents';
import useStyle from './style';
import { eventBoxChangeType } from './styles';
const { GET_COMPANY_NAME } = CompanyQueries;

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum actionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
}

export enum EventCode {
  ADD_COMPANY_TO_PROJECT = 'ADD_COMPANY_TO_PROJECT',
  REMOVE_COMPANY_FROM_PROJECT = 'REMOVE_COMPANY_FROM_PROJECT',
  ANSWER_PROJECT_COMPANY_CRITERIA = 'ANSWER_PROJECT_COMPANY_CRITERIA',
  UPDATE_PROJECT_STATUS = 'UPDATE_PROJECT_STATUS',
  UPDATE_PROJECT_INFO = 'UPDATE_PROJECT_INFO',
  ADD_PROJECT_COLLABORATORS = 'ADD_PROJECT_COLLABORATORS',
  RESPONSE_PROJECT_COLLABORATORS = 'RESPONSE_PROJECT_COLLABORATORS',
  UPDATE_PROJECT_COMPANIES = 'UPDATE_PROJECT_COMPANIES',
  EVALUATE_PROJECT_COMPANY = 'EVALUATE_PROJECT_COMPANY',
  UPDATE_COMPANY_EVALUATION = 'UPDATE_COMPANY_EVALUATION',
  CREATE_PROJECT = 'CREATE_PROJECT',
  CANCEL_PROJECT = 'CANCEL_PROJECT',
  ARCHIVE_PROJECT = 'ARCHIVE_PROJECT',
  PAUSE_PROJECT = 'PAUSE_PROJECT',
  REQUEST_PROJECT_OFFICIAL = 'REQUEST_PROJECT_OFFICIAL',
  RESPONSE_PROJECT_OFFICIAL = 'RESPONSE_PROJECT_OFFICIAL',
  CREATE_COMPANY = 'CREATE_COMPANY',
  UPDATE_COMPANY_SETTINGS = 'UPDATE_COMPANY_SETTINGS',
  UPDATE_COMPANY = 'UPDATE_COMPANY',
  CREATE_COMPANY_INSURANCE = 'CREATE_COMPANY_INSURANCE',
  UPDATE_COMPANY_INSURANCE = 'UPDATE_COMPANY_INSURANCE',
  CREATE_COMPANY_CERTIFICATION = 'CREATE_COMPANY_CERTIFICATION',
  UPDATE_COMPANY_CERTIFICATION = 'UPDATE_COMPANY_CERTIFICATION',
  CREATE_COMPANY_PRODUCT = 'CREATE_COMPANY_PRODUCT',
  UPDATE_COMPANY_PRODUCT = 'UPDATE_COMPANY_PRODUCT',
  CREATE_COMPANY_LOCATION = 'CREATE_COMPANY_LOCATION',
  UPDATE_COMPANY_LOCATION = 'UPDATE_COMPANY_LOCATION',
  CREATE_COMPANY_CONTACT = 'CREATE_COMPANY_CONTACT',
  UPDATE_COMPANY_CONTACT = 'UPDATE_COMPANY_CONTACT',
  CREATE_COMPANY_CONTINGENCY = 'CREATE_COMPANY_CONTINGENCY',
  UPDATE_COMPANY_CONTINGENCY = 'UPDATE_COMPANY_CONTINGENCY',
  UPDATE_COMPANY_STATUS = 'UPDATE_COMPANY_STATUS',
  UPDATE_COMPANY_TYPE = 'UPDATE_COMPANY_TYPE',
  REMOVE_FROM_COMPANY_LIST = 'REMOVE_FROM_COMPANY_LIST',
  ADD_TO_COMPANY_LIST = 'ADD_TO_COMPANY_LIST',
  SHARED_LIST = 'SHARED_LIST',
  SHARED_LIST_CHANGE_STATUS = 'SHARED_LIST_CHANGE_STATUS',
  SET_SUPPLIER_TIER_COMPANY = 'SET_SUPPLIER_TIER_COMPANY',
}

const EventChangeBox: FC<BoxProps & { label: string; icon?: FC }> = ({ label, icon, ...props }) => (
  <Box borderRadius="4px" p="3px 8px" {...props}>
    <Flex>
      {icon}
      <Text textStyle="tableSubInfoSecondary">{label}</Text>
    </Flex>
    {props.children}
  </Box>
);

const AddCompanyToProject = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {props.isAlert ? (
        <>
          <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
          {t(' was ')}
          {props.event?.meta?.actionType?.toLowerCase?.()}
          {t(' to ')}
          <ProjectLink id={props.event?.meta?.projectId} name={props.event?.meta?.projectName} />
        </>
      ) : (
        <>
          {props.dashboard && props.tenant ? (
            <Flex
              bg="#F1F1F1"
              color="#2A2A28"
              fontSize="12px"
              fontFamily="poppins"
              borderRadius="4px"
              p="3px 8px"
              mt="2px"
            >
              <CompanyAvatar p="1px" mr="3px" size="2xs" mt="1px" companyId={props.event?.entityId ?? ''} />
              <CompanyLink
                id={props.event?.entityId}
                name={props.event?.meta?.companyName}
                dashboard={props?.dashboard}
              />
            </Flex>
          ) : null}
          <EventChangeBox
            bg="green.100"
            label={capitalizeFirstLetter(
              props.event?.meta?.actionType.toLowerCase() + t(props?.dashboard ? '' : ' to ')
            )}
          />
          {props.dashboard ? (
            <>
              {props?.tenant && (
                <Text
                  fontWeight="400"
                  color="#797978"
                  fontSize="12px"
                  fontStyle="italic"
                  fontFamily="poppins"
                  pr="2"
                  ml="5px"
                >
                  to
                </Text>
              )}
              <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" fontFamily="poppins" borderRadius="4px" p="3px 8px">
                <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
                <ProjectLink
                  id={props.event?.meta?.projectId}
                  name={props.event?.meta?.projectName}
                  dashboard={props?.dashboard}
                />
              </Flex>
            </>
          ) : (
            <ProjectLink id={props.event?.meta?.projectId} name={props.event?.meta?.projectName} />
          )}
        </>
      )}
    </Stack>
  );
};

const RemoveCompanyFromProject = (props: { event: any; isAlert?: boolean }) => {
  const { t } = useTranslation();
  return (
    <>
      <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
      {t(' was removed from ')}
      <ProjectLink id={props.event?.meta?.projectId} name={props.event?.meta?.projectName} />
    </>
  );
};
const PreviousStatus: any = {
  OPEN: 'NEW',
  INREVIEW: 'OPEN',
  INPROGRESS: 'INREVIEW',
  COMPLETED: 'INPROGRESS',
};
const UpdateProjectStatus = (props: { event: any; isAlert?: boolean; tenant?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();

  return (
    <>
      {!props.isAlert ? (
        <Flex alignItems="center" mt="3px">
          <EventChangeBox bg="#F1F1F1" label={t(' set the status')} />
          <Flex alignItems="center" pl="2">
            <EventChangeBox
              bg="event.red"
              label={projectStatusMapper?.[PreviousStatus?.[props?.event?.meta?.status]] ?? ''}
            />
            <BiRightArrowAlt />
          </Flex>
          <EventChangeBox bg="event.green" label={projectStatusMapper[props?.event?.meta?.status] ?? ''} />
          {props?.tenant && (
            <>
              <Text
                fontWeight="400"
                color="#797978"
                fontSize="12px"
                fontStyle="italic"
                fontFamily="poppins"
                px="2"
                mx="2px"
              >
                to
              </Text>
              <Flex
                bg="#F1F1F1"
                color="#2A2A28"
                fontSize="12px"
                fontFamily="poppins"
                borderRadius="4px"
                p="3px 8px"
                mt="-2px"
              >
                <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
                <ProjectLink
                  id={props.event?.entityId}
                  name={props.event?.meta?.projectName}
                  dashboard={props?.dashboard}
                />
              </Flex>
            </>
          )}
        </Flex>
      ) : (
        <>
          {t('Status of ')}
          <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
          {t(' was set to ')}
          {projectStatusMapper[props?.event?.meta?.status] ?? ''}
        </>
      )}
    </>
  );
};
const UpdateProjectCompaniesMessage = (props: {
  event: any;
  isAlert?: boolean;
  dashboard?: boolean;
  tenant?: boolean;
}) => {
  const { t } = useTranslation();

  const avatar: any = <CompanyAvatar p="1px" marginRight="4px" size="2xs" companyId={props.event?.meta?.companyId} />;
  return (
    <Stack isInline mt="5px">
      {props.isAlert ? (
        <>
          {t(' was ')}
          {props.event?.meta?.actionType?.toLowerCase?.()}
          {t(' to ')}
          <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
        </>
      ) : (
        <>
          <EventChangeBox
            bg="green.100"
            label={
              (props?.dashboard ? '' : 'Added to ') + capitalizeFirstLetter(props.event?.meta?.actionType.toLowerCase())
            }
          />
          {!props?.dashboard && (
            <EventChangeBox icon={avatar} marginLeft="5px" bg="event.gray" label={props.event?.meta?.companyName} />
          )}
          {props.dashboard && (
            <>
              <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" fontFamily="poppins" borderRadius="4px" p="3px 8px">
                <CompanyAvatar p="1px" mr="3px" mt="1px" size="2xs" companyId={props.event?.meta?.companyId} />
                <CompanyLink
                  id={props.event?.entityId}
                  name={props.event?.meta?.companyName}
                  dashboard={props?.dashboard}
                />
              </Flex>
              {props?.tenant && (
                <>
                  <Text
                    fontWeight="400"
                    color="#797978"
                    fontSize="12px"
                    fontStyle="italic"
                    fontFamily="poppins"
                    pr="2"
                    ml="5px"
                    pt="1"
                  >
                    to
                  </Text>

                  <Flex
                    bg="#F1F1F1"
                    color="#2A2A28"
                    fontSize="12px"
                    fontFamily="poppins"
                    borderRadius="4px"
                    p="3px 8px"
                    mt="2px"
                  >
                    <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
                    <ProjectLink
                      id={props.event?.entityId}
                      name={props.event?.meta?.projectName}
                      dashboard={props?.dashboard}
                    />
                  </Flex>
                </>
              )}
            </>
          )}
        </>
      )}
    </Stack>
  );
};
const CreateProjectMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' was created')}
    </>
  ) : (
    <Stack isInline mt="5px">
      <EventChangeBox label={t(' created the project')} bg="#F1F1F1" />
      {props?.dashboard && props?.tenant && (
        <>
          {' '}
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            ml="6px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
          >
            <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
            <ProjectLink
              id={props.event?.meta?.projectId}
              name={props.event?.meta?.projectName}
              dashboard={props?.dashboard}
            />
          </Flex>
        </>
      )}
    </Stack>
  );
};

const CancelProjectMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' was canceled')}
    </>
  ) : (
    <>
      <EventChangeBox label={'canceled'} bg="event.red" />
      {props?.dashboard && props?.tenant && (
        <>
          {' '}
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            ml="6px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
          >
            <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
            <ProjectLink
              id={props.event?.meta?.projectId}
              name={props.event?.meta?.projectName}
              dashboard={props?.dashboard}
            />
          </Flex>
        </>
      )}
    </>
  );
};

const ProjectRequestOfficialMessage = (props: { event: any; isAlert?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' was requested to be Official')}
    </>
  ) : (
    <>{t('requested to be Official')}</>
  );
};

const ProjectResponseOfficialMessage = (props: { event: any; isAlert?: boolean }) => {
  const { t } = useTranslation();
  return (
    <>
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' has been set as ')}
      {props.event?.meta?.actionType?.toLowerCase()}
    </>
  );
};

interface ActionInterface {
  message: string;
  link: any;
}
const UpdateCompanySettingsMessage: any = (props: {
  event: any;
  isAlert?: boolean;
  dashboard: boolean;
  tenant: boolean;
}) => {
  const { t } = useTranslation();
  const { meta } = props.event;
  const action: ActionInterface = {
    message: '',
    link: null,
  };

  const image: any = <Image mr="2" w="13px" h="16px" src="/icons/edit_icon.svg" />;

  const { setting, settingValue } = meta;
  if (!props.isAlert) {
    return (
      <>
        {props.dashboard && props.tenant ? (
          <Stack direction="row" spacing={1}>
            <EventChangeBox
              mt="2px"
              label={settingValue ? t('added') : t('removed')}
              bg={settingValue ? 'event.red' : 'event.green'}
            />
            <Stack
              bg="#F1F1F1"
              color="#2A2A28"
              fontSize="12px"
              fontFamily="poppins"
              borderRadius="4px"
              p="3px 8px"
              isInline
            >
              <CompanyAvatar mt="1px" size="2xs" mr="-3px" companyId={props.event?.meta?.companyId} />
              <CompanyLink
                id={props.event?.entityId}
                name={props.event?.meta?.companyName}
                dashboard={props?.dashboard}
              />
            </Stack>
            <Text
              fontWeight="400"
              color="#747473"
              fontSize="12px"
              fontStyle="italic"
              fontFamily="poppins"
              pr="2"
              pt="0.5"
            >
              {settingValue ? t('to') : t('from')}
            </Text>
            <EventChangeBox
              icon={image}
              label={setting === 'isFavorite' ? t('Favorites') : t('List placeholder')}
              bg="event.gray"
            />
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <EventChangeBox
              label={settingValue ? t('added to') : t('removed from')}
              bg={settingValue ? 'event.red' : 'event.green'}
            />
            <EventChangeBox
              icon={image}
              label={setting === 'isFavorite' ? t('Favorites') : t('List placeholder')}
              bg="event.gray"
            />
          </Stack>
        )}
      </>
    );
  }

  if (setting === 'isFavorite') {
    action.message = settingValue ? t(' was added to ') : t(' was removed from ');
    action.link = <CommonLink name="Favorites" target="companies" />;
  } else if (setting === 'isToCompare') {
    action.message = settingValue ? t(' was added to ') : t(' was removed from ');
    action.link = <CommonLink name="Comparison" target="comparison" />;
  }

  return (
    <>
      <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
      {action.message}
      {action.link}
    </>
  );
};

const ArchiveProjectMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' was archived')}
    </>
  ) : (
    <>
      <EventChangeBox label={t('Archived')} bg="event.gray" />
      {props?.dashboard && props?.tenant && (
        <>
          {' '}
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            ml="6px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
          >
            <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
            <ProjectLink
              id={props.event?.meta?.projectId}
              name={props.event?.meta?.projectName}
              dashboard={props?.dashboard}
            />
          </Flex>
        </>
      )}
    </>
  );
};

const PauseProjectMessage = (props: { event: any; isAlert?: boolean }) => {
  const { t } = useTranslation();
  const { meta } = props.event;
  const { settingValue } = meta;

  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' was set ')}
      {settingValue ? t('on going') : t('on hold')}
    </>
  ) : (
    <EventChangeBox label={t('Pause')} bg="event.gray" />
  );
};

const ProjectInvitation = (props: { event: any; isAlert?: boolean; dashboard: boolean }) => {
  const { t } = useTranslation();
  const { meta } = props.event;
  const { type } = meta;
  const classes = useStyle();

  return props.isAlert ? (
    <>
      {t("You've been invited to ")}
      <Link state={{ tab: 1 }} className={clsx(classes.link, 'alert_link')} to={`/projects`}>
        {props.event?.meta?.projectName}
      </Link>
      {t(' as ')}
      {type}
    </>
  ) : props?.dashboard ? (
    <EventChangeBox label={t("You've been invited as ") + type} bg={'#F1F1F1'} />
  ) : (
    <Text textStyle="body"> {t("You've been invited as ") + type}</Text>
  );
};

const ProjectInvitationResponse = (props: { event: any; isAlert?: boolean }) => {
  const { t } = useTranslation();
  const { meta } = props.event;
  const { status, type, userName } = meta;
  const userStatus = status === 'accept' ? 'accepted' : status;

  return props.isAlert ? (
    <>
      {`${userName} ${userStatus}`}
      {t(' invitation to ')}
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' as ')} {type}
    </>
  ) : (
    <Flex alignItems="center">
      <Text pr="1" textStyle="body" display="inline">
        {userStatus + t(' invitation')}
      </Text>
    </Flex>
  );
};

const UpdateProjectInfo = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      {t('Project information for ')}
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
      {t(' was changed')}
    </>
  ) : props.dashboard ? (
    <EventChangeBox label={t('updated information')} bg={'#F1F1F1'} />
  ) : (
    <Text textStyle="body">{t('updated information')}</Text>
  );
};

const UpdateCompanyStatusMessage = (props: {
  event: any;
  isAlert?: boolean;
  dashboard?: boolean;
  tenant?: boolean;
}) => {
  const { t } = useTranslation();

  const { data, loading } = useQuery(GET_COMPANY_NAME, {
    variables: { id: props.event?.entityId },
    fetchPolicy: 'cache-first',
  });
  const companyName = getCompanyName(data?.searchCompanies?.results?.[0]);
  const StatusType = props.event?.meta?.status?.toLowerCase?.();
  const GetStatusType = (status: string) => {
    const MessageType = {
      active: {
        from: t('Inactive'),
        to: t(' Active'),
        toBg: 'green.100',
        fromBg: 'red.100',
      },
      inactive: {
        from: t('Active'),
        to: t(' Inactive'),
        toBg: 'red.100',
        fromBg: 'green.100',
      },
      archived: {
        from: t('Inactive'),
        to: t(' Archived'),
        toBg: 'event.gray',
        fromBg: 'red.100',
      },
    };
    return MessageType[status as SupplierStatus];
  };
  const { to, from, toBg, fromBg } = GetStatusType(StatusType);

  return loading ? (
    <CircularProgress />
  ) : props.isAlert ? (
    <>
      {t('Status for ')}
      <CompanyLink id={props.event?.entityId} name={companyName} />
      {t(' was set to ')}
      {props.event?.meta?.status}
    </>
  ) : (
    <Flex>
      {props.dashboard ? (
        <EventChangeBox bg="#F1F1F1" label={'Changed Status'} />
      ) : (
        <>
          <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
          <Text fontWeight="400" color="#747473" fontStyle="italic" fontFamily="poppins" pr="3" marginLeft="2">
            Changed Status
          </Text>
        </>
      )}

      {props.dashboard && props?.tenant && (
        <>
          <Text
            fontWeight="400"
            color="#797978"
            ml="5px"
            fontSize="12px"
            fontStyle="italic"
            fontFamily="poppins"
            pr="2"
            pt="4px"
          >
            of
          </Text>
          <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" fontFamily="poppins" borderRadius="4px" p="3px 8px">
            <CompanyAvatar p="1px" mr="3px" size="2xs" companyId={props.event?.meta?.companyId} />
            <CompanyLink
              id={props.event?.entityId}
              name={props.event?.meta?.companyName}
              dashboard={props?.dashboard}
            />
          </Flex>
        </>
      )}

      <Flex alignItems="center" pl="2">
        <EventChangeBox bg={fromBg} label={t(from)} />
        <BiRightArrowAlt />
      </Flex>
      <EventChangeBox bg={toBg} label={t(to)} />
    </Flex>
  );
};

const UpdateCompany = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { loading } = useQuery(GET_COMPANY_NAME, {
    variables: { id: props.event?.entityId },
    fetchPolicy: 'cache-first',
  });

  const updates = props.event?.meta?.updates?.map((updates: any) => updates);
  const eventString = updates
    .map((element: { id: string; from: string; to: string }) => {
      const { id, to, from } = element;
      return fixNamesObj(id, from, to);
    })
    .join(', ');
  const textNoTags = updates.some((type: any) => type.id !== 'tags') ? 'Changed ' : '';

  return loading ? (
    <CircularProgress />
  ) : (
    <Tooltip
      label={eventString}
      visibility={props.dashboard && eventString.length >= 38 ? 'visible' : 'hidden'}
      bg="white"
      color="black"
      border="1px"
      borderColor="#E0E0E0"
    >
      <Flex>
        <Text
          {...(props?.dashboard && { maxW: '290px' })}
          fontWeight="400"
          textStyle={props?.dashboard ? 'tableSubInfoSecondary' : ''}
          color={props?.dashboard ? '' : '#747473'}
          fontStyle={props?.dashboard ? '' : 'italic'}
          pr="3"
          bg={props?.dashboard ? '#F1F1F1' : ''}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="normal"
          {...(props?.dashboard && { p: '3px 8px', borderRadius: '4px' })}
        >
          {eventString.length >= 38 && props.dashboard
            ? textNoTags + eventString.slice(0, 38) + '...'
            : textNoTags + eventString}
        </Text>
      </Flex>
    </Tooltip>
  );
};

const UpdateCompanyTypeMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();

  const { data, loading } = useQuery(GET_COMPANY_NAME, {
    variables: { id: props.event?.entityId },
    fetchPolicy: 'cache-first',
  });
  const companyName = getCompanyName(data?.searchCompanies?.results?.[0]);
  const isInternal = props.event?.meta?.type?.toLowerCase?.() === 'internal';

  return loading ? (
    <CircularProgress />
  ) : props.isAlert ? (
    <>
      {t('Type for ')}
      <CompanyLink id={props.event?.entityId} name={companyName} />
      {t(' was set to ')}
      {props.event?.meta?.type}
    </>
  ) : (
    <Flex>
      {!props.dashboard && <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />}
      {props.dashboard ? (
        <EventChangeBox sx={eventBoxChangeType} label={'Changed Type'} />
      ) : (
        <>
          <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
          <Text fontWeight="400" color="#747473" fontStyle="italic" fontFamily="poppins" pr="3" marginLeft="2">
            Changed Type
          </Text>
        </>
      )}
      {props.dashboard && props?.tenant && (
        <>
          <Text
            fontWeight="400"
            color="#797978"
            ml="5px"
            fontSize="12px"
            fontStyle="italic"
            fontFamily="poppins"
            pr="2"
            pt="4px"
          >
            of
          </Text>
          <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" fontFamily="poppins" borderRadius="4px" p="3px 8px">
            <CompanyAvatar p="1px" mr="3px" size="2xs" companyId={props.event?.meta?.companyId} />
            <CompanyLink
              id={props.event?.entityId}
              name={props.event?.meta?.companyName}
              dashboard={props?.dashboard}
            />
          </Flex>
        </>
      )}
      <Flex alignItems="center" pl="2">
        <EventChangeBox
          bg={!isInternal ? 'event.red' : 'event.green'}
          label={!isInternal ? t('Internal') : t('External')}
        />
        <BiRightArrowAlt />
      </Flex>
      <EventChangeBox
        bg={isInternal ? 'event.red' : 'event.green'}
        label={isInternal ? t('Internal') : t('External')}
      />
    </Flex>
  );
};

const EvaluateProjectCompanyMessage = (props: {
  event: any;
  isAlert?: boolean;
  dashboard?: boolean;
  tenant?: boolean;
}) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_COMPANY_NAME, {
    variables: { id: props.event?.meta?.companyId },
    fetchPolicy: 'cache-first',
  });
  const companyName = getCompanyName(data?.searchCompanies?.results?.[0]);

  return loading ? (
    <CircularProgress />
  ) : props.isAlert ? (
    <>
      {t('Company ')}
      <CompanyLink id={props.event?.meta?.companyId} name={companyName} />
      {t(' was evaluated inside project ')}
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
    </>
  ) : (
    <Flex>
      <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" fontFamily="poppins" borderRadius="4px" p="3px 8px" mr="3px">
        <CompanyAvatar p="1px" mr="3px" mt="2px" size="2xs" companyId={props.event?.meta?.companyId} />
        <CompanyLink
          id={props.event?.meta?.companyId}
          name={props.event?.meta?.companyName}
          dashboard={props?.dashboard}
        />
      </Flex>
      {props?.dashboard ? (
        <EventChangeBox label={t(' was evaluated')} bg={'#F1F1F1'} />
      ) : (
        <Text mt="3px" textStyle="body" fontSize="12px">
          {t(' was evaluated')}
        </Text>
      )}
      {props?.dashboard && props?.tenant && (
        <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" ml="6px" fontFamily="poppins" borderRadius="4px" p="3px 8px">
          <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
          <ProjectLink
            id={props.event?.meta?.projectId}
            name={props.event?.meta?.projectName}
            dashboard={props?.dashboard}
          />
        </Flex>
      )}
    </Flex>
  );
};

const ProjectEvaluationUpdated = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_COMPANY_NAME, {
    variables: { id: props.event?.meta?.companyId },
    fetchPolicy: 'cache-first',
  });
  const companyName = getCompanyName(data?.searchCompanies?.results?.[0]);

  return loading ? (
    <CircularProgress />
  ) : props.isAlert ? (
    <>
      {t('Company ')}
      <CompanyLink id={props.event?.meta?.companyId} name={companyName} />
      {t(' evaluation was updated inside project ')}
      <ProjectLink id={props.event?.entityId} name={props.event?.meta?.projectName} />
    </>
  ) : (
    <Flex>
      <EventChangeBox label={t('an evaluation was updated')} bg={'#F1F1F1'} />
      {props?.dashboard && props?.tenant && (
        <Flex bg="#F1F1F1" color="#2A2A28" fontSize="12px" ml="6px" fontFamily="poppins" borderRadius="4px" p="3px 8px">
          <Image mr="2" w="20px" src="/icons/suitcase_log.svg" />
          <ProjectLink
            id={props.event?.meta?.projectId}
            name={props.event?.meta?.projectName}
            dashboard={props?.dashboard}
          />
        </Flex>
      )}
    </Flex>
  );
};

const RemoveCompanyFromList = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {props.isAlert ? (
        <>
          <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
          {t(' was ')}
          {props.event?.meta?.actionType?.toLowerCase?.()}
          {t(' to ')}
          <ProjectLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} />
        </>
      ) : props?.dashboard ? (
        <>
          <EventChangeBox
            label={props.event?.meta?.actionType === 'ADDED' ? t('added') : t('removed')}
            bg={props.event?.meta?.actionType === 'ADDED' ? 'event.red' : 'event.green'}
          />
          {props?.tenant && (
            <Flex
              bg="#F1F1F1"
              color="#2A2A28"
              fontSize="12px"
              fontFamily="poppins"
              borderRadius="4px"
              p="3px 8px"
              mt="2px"
            >
              <CompanyAvatar p="1px" mr="3px" mt="2px" size="2xs" companyId={props.event?.entityId} />
              <CompanyLink
                id={props.event?.entityId}
                name={props.event?.meta?.companyName}
                dashboard={props?.dashboard}
              />
            </Flex>
          )}
          <Text
            fontWeight="400"
            color="#797978"
            fontSize="12px"
            fontStyle="italic"
            fontFamily="poppins"
            pr="2"
            pt="0.5"
          >
            from
          </Text>
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
            mt="2px"
          >
            <Image mr="2" mt="2PX" w="13px" h="16px" src="/icons/edit_icon.svg" />
            <ListLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} dashboard={props?.dashboard} />
          </Flex>
        </>
      ) : (
        <>
          <EventChangeBox
            label={props.event?.meta?.actionType === 'ADDED' ? t('added to') : t('removed from')}
            bg={props.event?.meta?.actionType === 'ADDED' ? 'event.red' : 'event.green'}
          />
          <ListLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} />
        </>
      )}
    </Stack>
  );
};

const AddCompanyToList = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {props.isAlert ? (
        <>
          <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
          {t(' was ')}
          {props.event?.meta?.actionType?.toLowerCase?.()}
          {t(' to ')}
          <ProjectLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} />
        </>
      ) : props?.dashboard ? (
        <>
          <EventChangeBox
            label={props.event?.meta?.actionType === 'ADDED' ? t('added') : t('removed')}
            bg={props.event?.meta?.actionType === 'ADDED' ? 'event.red' : 'event.green'}
          />
          {props?.tenant && (
            <Flex
              bg="#F1F1F1"
              color="#2A2A28"
              fontSize="12px"
              fontFamily="poppins"
              borderRadius="4px"
              p="3px 8px"
              mt="2px"
            >
              <CompanyAvatar p="1px" mr="3px" mt="1px" size="2xs" companyId={props.event?.entityId} />
              <CompanyLink
                id={props.event?.entityId}
                name={props.event?.meta?.companyName}
                dashboard={props?.dashboard}
              />
            </Flex>
          )}
          <Text
            fontWeight="400"
            color="#797978"
            fontSize="12px"
            fontStyle="italic"
            fontFamily="poppins"
            pr="2"
            pt="0.5"
          >
            to
          </Text>
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
            mt="2px"
          >
            <Image mr="2" mt="2PX" w="13px" h="16px" src="/icons/edit_icon.svg" />
            <ListLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} dashboard={props?.dashboard} />
          </Flex>
        </>
      ) : (
        <>
          <EventChangeBox
            label={props.event?.meta?.actionType === 'ADDED' ? t('added to') : t('removed from')}
            bg={props.event?.meta?.actionType === 'ADDED' ? 'event.red' : 'event.green'}
          />
          <ListLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} />
        </>
      )}
    </Stack>
  );
};

const CreateInsuranceMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was created')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === actionType.CREATE ? t('created an ') : t('removed an ')}
        bg={props.event?.meta?.actionType === actionType.CREATE ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Insurance')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Insurance')}</Text>
      )}
    </>
  );
};

const CreateCertificationMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t('was created')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === actionType.CREATE ? t('created a ') : t('removed from')}
        bg={props.event?.meta?.actionType === actionType.CREATE ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Certification')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Certification')}</Text>
      )}
    </>
  );
};

const CreateContactMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was created')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === actionType.CREATE ? t('created a ') : t('removed from')}
        bg={props.event?.meta?.actionType === actionType.CREATE ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Contact')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Contact')}</Text>
      )}
    </>
  );
};
const CreateProductMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was created')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === actionType.CREATE ? t('created a ') : t('removed from')}
        bg={props.event?.meta?.actionType === actionType.CREATE ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Product')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Product')}</Text>
      )}
    </>
  );
};
const CreateLocationMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was created')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === actionType.CREATE ? t('created a ') : t('removed from')}
        bg={props.event?.meta?.actionType === actionType.CREATE ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Location')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Location')}</Text>
      )}
    </>
  );
};

const CreateContingencyMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was created')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === actionType.CREATE ? t('created a ') : t('removed from')}
        bg={props.event?.meta?.actionType === actionType.CREATE ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Contingency')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Contingency')}</Text>
      )}
    </>
  );
};

const UpdateCompanyInsurance = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();

  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === 'UPDATE' ? t('updated an ') : t('removed an')}
        bg={props.event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Insurance')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Insurance')}</Text>
      )}
    </>
  );
};

const UpdateCompanyCertification = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === 'UPDATE' ? t('updated a ') : t('removed from')}
        bg={props.event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Certification')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Certification')}</Text>
      )}
    </>
  );
};

const UpdateCompanyContact = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === 'UPDATE' ? t('updated a ') : t('removed from')}
        bg={props.event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Contact')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Contact')}</Text>
      )}
    </>
  );
};

const UpdateCompanyProduct = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === 'UPDATE' ? t('updated a ') : t('removed from')}
        bg={props.event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Product')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Product')}</Text>
      )}
    </>
  );
};

const UpdateCompanyLocation = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === 'UPDATE' ? t('updated a ') : t('removed from')}
        bg={props.event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Location')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Location')}</Text>
      )}
    </>
  );
};

const UpdateCompanyContingency = (props: { event: any; isAlert?: boolean; dashboard?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <ProjectLink id={props.event?.meta?.id} name={props.event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      <EventChangeBox
        label={props.event?.meta?.actionType === 'UPDATE' ? t('updated a ') : t('removed from')}
        bg={props.event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
      {props?.dashboard ? (
        <EventChangeBox ml="5px" label={t('Contingency')} bg={'#F1F1F1'} />
      ) : (
        <Text marginLeft={1}>{t('Contingency')}</Text>
      )}
    </>
  );
};
const SetSupplierTierCompany = (props: {
  event: any;
  isAlert?: boolean;
  dashboard?: boolean;
  tenant?: boolean;
  company?: any;
}) => {
  const { t } = useTranslation();
  const { event, isAlert, company } = props;
  const { meta } = event;
  const { updates } = meta;
  const { to } = updates[0];
  return isAlert ? (
    <>
      <ProjectLink id={event?.meta?.id} name={event?.meta?.companyName} />
      {t(' was updated')}
    </>
  ) : (
    <>
      {props?.dashboard ? (
        <>
          {' '}
          {props?.tenant && (
            <Flex
              bg="#F1F1F1"
              color="#2A2A28"
              fontSize="12px"
              fontFamily="poppins"
              borderRadius="4px"
              p="3px 8px"
              mr="4px"
            >
              <CompanyAvatar p="1px" mr="3px" mt="2px" size="2xs" companyId={props.event?.meta?.companyId} />
              <CompanyLink
                id={props.event?.entityId}
                name={company?.legalBusinessName ?? company?.legalBusinessName ?? company?.doingBusinessAs}
                dashboard={props?.dashboard}
              />
            </Flex>
          )}
          <EventChangeBox mr="5px" label={t(' becomes a')} bg="#F1F1F1" />
        </>
      ) : (
        <>
          <Text marginRight={2} marginLeft={2}>
            {t(` Company`)}
          </Text>
          <CompanyLink
            id={event?.entityId}
            name={company?.legalBusinessName ?? company?.legalBusinessName ?? company?.doingBusinessAs}
          />
          <Text marginRight={2} marginLeft={2}>
            {t(` becomes a`)}
          </Text>
        </>
      )}
      <EventChangeBox
        mt="1px"
        label={event?.meta?.actionType === 'UPDATE' ? t(`Supplier Tier ${to} `) : t('removed from')}
        bg={event?.meta?.actionType === 'UPDATE' ? 'event.red' : 'event.green'}
      />
    </>
  );
};

const SharedListStatusUpdate = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  const { event } = props;
  const { meta } = event;

  const color =
    meta?.status === SharedListStatus.APPROVED
      ? 'green.100'
      : meta?.status === SharedListStatus.DECLINED
        ? 'red.100'
        : '#F1F1F1';

  return (
    <>
      {props?.dashboard && props?.tenant && (
        <>
          <EventChangeBox mr="5px" mt="5px" label={t(` ${meta?.status} the invite `)} bg={color} />
          <Text
            fontWeight="400"
            color="#797978"
            fontSize="12px"
            fontStyle="italic"
            fontFamily="poppins"
            pr="2"
            ml="5px"
            mt="5px"
          >
            to
          </Text>
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
            mt="2px"
          >
            <Image mr="2" mt="2PX" w="13px" h="16px" src="/icons/edit_icon.svg" />
            <ListLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} dashboard={props?.dashboard} />
          </Flex>
        </>
      )}
    </>
  );
};

const SharedListCreate = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  const { event } = props;
  const { meta } = event;

  const color =
    meta?.status === SharedListStatus.APPROVED
      ? 'green.100'
      : meta?.status === SharedListStatus.DECLINED
        ? 'red.100'
        : '#F1F1F1';
  const selectTexttByStatus = (status: string | undefined, body: string, meta: MetaEvent) => {
    if (!status) return t('Shared list event not found');
    const { listName } = meta;
    const bodyToArra = body.split(' ');

    const userInvitatedNameList = {
      [SharedListStatus.PENDING]: `${bodyToArra[bodyToArra.length - 2]} ${bodyToArra[bodyToArra.length - 1]}`,
      [SharedListStatus.APPROVED]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
      [SharedListStatus.DECLINED]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
      [SharedListStatus.DELETED]: ` ${bodyToArra[0]} ${bodyToArra[1]}`,
    };

    const userInvitatedName = userInvitatedNameList[status as SharedListStatus];

    const textList = {
      [SharedListStatus.PENDING]: `invited ${capitalizeFirstLetter(userInvitatedName)}`,
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
    <>
      {props?.dashboard && props?.tenant && (
        <>
          <EventChangeBox mr="5px" mt="5px" label={t(`${textEvent}`)} bg={color} />
          <Text
            fontWeight="400"
            color="#797978"
            fontSize="12px"
            fontStyle="italic"
            fontFamily="poppins"
            pr="2"
            ml="5px"
            mt="5px"
          >
            to
          </Text>
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
            mt="2px"
          >
            <Image mr="2" mt="2PX" w="13px" h="16px" src="/icons/edit_icon.svg" />
            <ListLink id={props.event?.meta?.listId} name={props.event?.meta?.listName} dashboard={props?.dashboard} />
          </Flex>
        </>
      )}
    </>
  );
};

const CreateCompanyMessage = (props: { event: any; isAlert?: boolean; dashboard?: boolean; tenant?: boolean }) => {
  const { t } = useTranslation();
  return props.isAlert ? (
    <>
      <CompanyLink id={props.event?.entityId} name={props.event?.meta?.companyName} />
      {t(' was created')}
    </>
  ) : (
    <Stack isInline mt="5px">
      <EventChangeBox label={t(' created the company')} bg="#F1F1F1" />
      {props?.dashboard && props?.tenant && (
        <>
          {' '}
          <Flex
            bg="#F1F1F1"
            color="#2A2A28"
            fontSize="12px"
            ml="6px"
            fontFamily="poppins"
            borderRadius="4px"
            p="3px 8px"
          >
            <CompanyAvatar p="1px" mr="3px" size="2xs" mt="1px" companyId={props.event?.entityId ?? ''} />
            <CompanyLink
              id={props.event?.entityId}
              name={props.event?.meta?.companyName}
              dashboard={props?.dashboard}
            />
          </Flex>
        </>
      )}
    </Stack>
  );
};

export const eventComponents: any = {
  [EventCode.ADD_COMPANY_TO_PROJECT]: AddCompanyToProject,
  [EventCode.REMOVE_COMPANY_FROM_PROJECT]: RemoveCompanyFromProject,
  [EventCode.UPDATE_PROJECT_STATUS]: UpdateProjectStatus,
  [EventCode.EVALUATE_PROJECT_COMPANY]: EvaluateProjectCompanyMessage,
  [EventCode.UPDATE_COMPANY_EVALUATION]: ProjectEvaluationUpdated,
  [EventCode.UPDATE_PROJECT_INFO]: UpdateProjectInfo,
  [EventCode.UPDATE_PROJECT_COMPANIES]: UpdateProjectCompaniesMessage,
  [EventCode.CREATE_PROJECT]: CreateProjectMessage,
  [EventCode.CANCEL_PROJECT]: CancelProjectMessage,
  [EventCode.ARCHIVE_PROJECT]: ArchiveProjectMessage,
  [EventCode.PAUSE_PROJECT]: PauseProjectMessage,
  [EventCode.REQUEST_PROJECT_OFFICIAL]: ProjectRequestOfficialMessage,
  [EventCode.RESPONSE_PROJECT_OFFICIAL]: ProjectResponseOfficialMessage,
  [EventCode.UPDATE_COMPANY_SETTINGS]: UpdateCompanySettingsMessage,
  [EventCode.ADD_PROJECT_COLLABORATORS]: ProjectInvitation,
  [EventCode.RESPONSE_PROJECT_COLLABORATORS]: ProjectInvitationResponse,
  [EventCode.UPDATE_COMPANY_STATUS]: UpdateCompanyStatusMessage,
  [EventCode.UPDATE_COMPANY_TYPE]: UpdateCompanyTypeMessage,
  [EventCode.UPDATE_COMPANY]: UpdateCompany,
  [EventCode.REMOVE_FROM_COMPANY_LIST]: RemoveCompanyFromList,
  [EventCode.ADD_TO_COMPANY_LIST]: AddCompanyToList,
  [EventCode.CREATE_COMPANY_INSURANCE]: CreateInsuranceMessage,
  [EventCode.CREATE_COMPANY_CERTIFICATION]: CreateCertificationMessage,
  [EventCode.CREATE_COMPANY_CONTACT]: CreateContactMessage,
  [EventCode.CREATE_COMPANY_PRODUCT]: CreateProductMessage,
  [EventCode.CREATE_COMPANY_LOCATION]: CreateLocationMessage,
  [EventCode.CREATE_COMPANY_CONTINGENCY]: CreateContingencyMessage,
  [EventCode.UPDATE_COMPANY_INSURANCE]: UpdateCompanyInsurance,
  [EventCode.UPDATE_COMPANY_CERTIFICATION]: UpdateCompanyCertification,
  [EventCode.UPDATE_COMPANY_CONTACT]: UpdateCompanyContact,
  [EventCode.UPDATE_COMPANY_PRODUCT]: UpdateCompanyProduct,
  [EventCode.UPDATE_COMPANY_LOCATION]: UpdateCompanyLocation,
  [EventCode.UPDATE_COMPANY_CONTINGENCY]: UpdateCompanyContingency,
  [EventCode.SET_SUPPLIER_TIER_COMPANY]: SetSupplierTierCompany,
  [EventCode.SHARED_LIST_CHANGE_STATUS]: SharedListStatusUpdate,
  [EventCode.SHARED_LIST]: SharedListCreate,
  [EventCode.CREATE_COMPANY]: CreateCompanyMessage,
};
interface NotificationsMessageProps {
  alert: any;
  className?: string;
}
export const NotificationMessage = (props: NotificationsMessageProps) => {
  const { alert, className } = props;
  const code: EventCode = alert.code;

  if (code in eventComponents) {
    const ComponentToRender = eventComponents[code];
    return (
      <span className={className}>
        <ComponentToRender event={alert} isAlert={true} />
      </span>
    );
  }

  return null;
};

export const withMouseEvent = (WrappedComponent: any) => (props: { onMouseEnter?: () => void }) => {
  const { onMouseEnter, ...rest } = props;

  return (
    <Flex onMouseEnter={onMouseEnter} direction="row-reverse" justifyContent="space-between" data-testid="snackbar">
      <WrappedComponent {...(rest && rest)} />
    </Flex>
  );
};

const NotificationContent = (props: NotificationsMessageProps & { onMouseEnter?: () => void }) => {
  const Component = withMouseEvent(NotificationMessage);

  return <Component {...props} />;
};

export default NotificationContent;
