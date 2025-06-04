import { useTranslation } from 'react-i18next';
import { Text, Stack } from '@chakra-ui/react';
import { CompanyLink } from '../EntityLink';
import { EventCode } from '../NotificationPopup';
import { ProjectType } from '../../graphql/enums';
import { useState } from 'react';

const AnswerProjectCompanyCriteriaMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  const { meta } = props.activityLog;
  const [showCriteria, setShowCriteria] = useState(false);

  const answerMappers = (value: boolean | null) => {
    if (value === true) {
      return t('Yes');
    } else if (value === false) {
      return t('No');
    } else {
      return t('NA');
    }
  };
  const criteriaAnswers = JSON.parse(meta?.answers?.replaceAll('', '')) ?? [];
  return (
    <Stack>
      <Stack isInline={true}>
        <Text as="h2" textStyle="h2">
          {t('Project criteria answers for ')}
          <CompanyLink id={meta?.companyId} name={meta?.companyName} />
        </Text>
        {meta ? (
          <Text
            lineHeight="30px"
            cursor="pointer"
            onClick={() => setShowCriteria(!showCriteria)}
            color={showCriteria ? 'green.700' : 'green.400'}
          >
            {showCriteria ? 'Hide changes' : 'Show changes'}
          </Text>
        ) : null}
      </Stack>
      {showCriteria ? (
        <>
          {criteriaAnswers.map((criteria: any, index: number) => {
            return (
              <Stack key={index} isInline={true}>
                <Text>{criteria.criteria + ': '}</Text>
                <Text
                  color={
                    answerMappers(criteria.answer) === t('Yes')
                      ? 'green'
                      : answerMappers(criteria.answer) === t('No')
                        ? 'red'
                        : 'gray'
                  }
                >
                  {answerMappers(criteria.answer)}
                </Text>
              </Stack>
            );
          })}
        </>
      ) : null}
    </Stack>
  );
};

const ArchiveProjectMessage = () => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {t('Project was archived')}
    </Text>
  );
};

const CancelProjectMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {t('Project ')}
      {props.activityLog?.meta?.projectName}
      {t(' was canceled')}
    </Text>
  );
};

const CreateProjectMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {t('Project was created')}
    </Text>
  );
};

const EvaluateCompanyMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      <CompanyLink id={props.activityLog?.meta?.companyId} name={props.activityLog?.meta?.companyName} />
      {t(' was evaluated')}
    </Text>
  );
};

const PauseProjectMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  const { meta } = props.activityLog;
  const { settingValue } = meta;

  return (
    <Text as="h2" textStyle="h2">
      {t('Project was set ')}
      {settingValue ? t('on going') : t('on hold')}
    </Text>
  );
};

const ProjectInvitationMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  const { meta } = props.activityLog;
  const { type, userName } = meta ?? {};

  return (
    <Text as="h2" textStyle="h2">
      {userName + t(' was invited as ') + type}
    </Text>
  );
};

const ProjectInvitationResponseMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  const { meta, userName } = props.activityLog;
  const { type, status } = meta ?? {};
  const userStatus = status === 'accept' ? 'accepted' : status;

  return (
    <Text as="h2" textStyle="h2">
      {`${userName} ${userStatus}`}
      {t(' invitation as ')}
      {type}
    </Text>
  );
};

const ProjectRequestOfficialMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {t('Project was pending to set official')}
    </Text>
  );
};

const ProjectResponseOfficialMessage = (props: { activityLog: any }) => {
  const {
    meta: { actionType },
  } = props.activityLog;
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {actionType === ProjectType.OFFICIAL ? t('Project was set official') : t('Project was set unofficial')}
    </Text>
  );
};

const UpdateCompanyEvaluationMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      <CompanyLink id={props.activityLog?.meta?.companyId} name={props.activityLog?.meta?.companyName} />
      {t(' evaluation was updated')}
    </Text>
  );
};

const UpdateProjectCompaniesMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {t('Company ')}
      <CompanyLink id={props.activityLog?.meta?.companyId} name={props.activityLog?.meta?.companyName} />
      {t(' was ')}
      {props.activityLog?.meta?.actionType?.toLowerCase?.()}
    </Text>
  );
};

const UpdateProjectInfoMessage = (props: { activityLog: any }) => {
  const { t } = useTranslation();

  return (
    <Text as="h2" textStyle="h2">
      {t('Project information was changed')}
    </Text>
  );
};

const UpdateProjectStatus = (props: { activityLog: any }) => {
  const { t } = useTranslation();
  return (
    <Text as="h2" textStyle="h2">
      {t('Project Status updated to ')}
      {props.activityLog?.meta?.status === 'INPROGRESS'
        ? 'IN PROGRESS'
        : props.activityLog?.meta?.status === 'INREVIEW'
          ? 'REVIEW'
          : props.activityLog?.meta?.status}
    </Text>
  );
};

export const activitylogComponents: any = {
  [EventCode.UPDATE_PROJECT_STATUS]: UpdateProjectStatus,
  [EventCode.UPDATE_PROJECT_INFO]: UpdateProjectInfoMessage,
  [EventCode.UPDATE_PROJECT_COMPANIES]: UpdateProjectCompaniesMessage,
  [EventCode.EVALUATE_PROJECT_COMPANY]: EvaluateCompanyMessage,
  [EventCode.UPDATE_COMPANY_EVALUATION]: UpdateCompanyEvaluationMessage,
  [EventCode.CREATE_PROJECT]: CreateProjectMessage,
  [EventCode.CANCEL_PROJECT]: CancelProjectMessage,
  [EventCode.ARCHIVE_PROJECT]: ArchiveProjectMessage,
  [EventCode.PAUSE_PROJECT]: PauseProjectMessage,
  [EventCode.REQUEST_PROJECT_OFFICIAL]: ProjectRequestOfficialMessage,
  [EventCode.RESPONSE_PROJECT_OFFICIAL]: ProjectResponseOfficialMessage,
  [EventCode.ADD_PROJECT_COLLABORATORS]: ProjectInvitationMessage,
  [EventCode.RESPONSE_PROJECT_COLLABORATORS]: ProjectInvitationResponseMessage,
  [EventCode.ANSWER_PROJECT_COMPANY_CRITERIA]: AnswerProjectCompanyCriteriaMessage,
};
