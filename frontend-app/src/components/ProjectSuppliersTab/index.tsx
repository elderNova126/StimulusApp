import { useMutation } from '@apollo/client';
import { Box, Divider, Text, useToast } from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';
import { PartialProject } from '../../graphql/dto.interface';
import { SupplierStatus, SupplierType } from '../../graphql/enums';
import { useStimulusToast } from '../../hooks';
import { capitalizeFirstLetter, getCompanyName } from '../../utils/dataMapper';

import { Stack } from '@chakra-ui/layout';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { ProjectStatus } from '../../graphql/enums';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import { CompanyLink } from '../EntityLink';
import MessageComponent from '../GenericComponents/MessageComponent';
import ChangeCompanyTypeModal, { CriteriaCheckModal } from './Modals';
import Supplier from './Supplier';
import LoadingScreen from '../LoadingScreen';
import StimButton from '../ReusableComponents/Button';

export enum CompanyType {
  AWARDED = 'awarded',
  SHORTLISTED = 'shortlisted',
  QUALIFIED = 'qualified',
  CONSIDERED = 'considered',
}

const { UPDATE_COMPANY_CRITERIA_ANSWER_GQL } = CompanyMutations;
const { UPDATE_PROJECT_COMPANIES } = ProjectMutations;

export interface CompanyToMove {
  nextType?: CompanyType;
  action?: string;
  company?: any;
}

interface Props {
  project: PartialProject;
  isLoading: boolean;
}

const ProjectSuppliersTab: FC<Props> = ({ project, isLoading }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const [updateProjectCompanies, { loading: updatingCompanies }] = useMutation(UPDATE_PROJECT_COMPANIES);
  const [updateProjectCompanyAnswers, { loading: updatingCompanyAnswers }] = useMutation(
    UPDATE_COMPANY_CRITERIA_ANSWER_GQL
  );
  const [draftAnswers, setDraftAnswers] = useState<{ [key: string]: boolean | null | undefined } | null>(null);
  const [companyToMove, setCompanyToMove] = useState<CompanyToMove>({});
  const [companyToAnswerCriteria, setCompanyToAnswerCriteria] = useState<CompanyToMove | null>();

  const toast = useToast();
  const toastIdRef: any = useRef();
  function closeToast() {
    toast.close(toastIdRef.current);
  }
  const handleUpdateError = (data: any) => {
    let message = `There was an error. Please try again`;
    if (data.code === 14) {
      if (!project.ongoing) {
        message = `Project is on hold! You need to resume project to make any change!`;
      } else if (project.status === ProjectStatus.CANCELED) {
        message = `Project is canceled! You cannot change a canceled project`;
      }
    }
    enqueueSnackbar(message, { status: 'error' });
  };

  const updateCompanyType = (company: any, companyType: CompanyType) => {
    updateProjectCompanies({
      variables: { projectId: project.id, companyId: company.id, companyType: companyType.toUpperCase() },
    }).then(({ data: { updateProjectCompanies: update } }: any) => {
      setCompanyToMove({});
      if (update.error) {
        return handleUpdateError(update);
      }
      setDraftAnswers(null);
      setCompanyToAnswerCriteria(null);
      if (
        (company?.tenantCompanyRelation?.type !== SupplierType.INTERNAL ||
          company?.tenantCompanyRelation?.status !== SupplierStatus.ACTIVE) &&
        companyType === CompanyType.QUALIFIED
      ) {
        enqueueSnackbar('Company type changed successfully', { status: 'success' });
        const message = (
          <span>
            {company ? <CompanyLink id={company.id} name={getCompanyName(company)} /> : t('Companies')}
            {t(' status changed to Active.')}
          </span>
        );
        toastIdRef.current = toast({
          render: () => <MessageComponent message={message} close={closeToast} />,
        });
      }
    });
  };

  const getCurrentCompaniesByTypeJsx = (type: CompanyType) => {
    if (project?.projectCompany?.length) {
      const projectCompanies = project.projectCompany.filter((relation: any) => {
        return relation.company !== null; // check if company is not deleted
      });
      return projectCompanies
        .filter((relation: any) => relation.type?.toUpperCase() === type.toUpperCase())
        .map((projectCompany: any) => {
          const { company, criteriaAnswers, suppliers } = projectCompany;
          switch (type) {
            case CompanyType.SHORTLISTED:
              return (
                <Supplier
                  buttonLabel={
                    project.status === 'INPROGRESS' || project.status === 'COMPLETED' ? undefined : t('award')
                  }
                  nextType={CompanyType.AWARDED}
                  key={`${company.id}_award`}
                  projectCompany={projectCompany}
                  setCompanyToAnswerCriteria={({ company }: CompanyToMove) =>
                    setCompanyToAnswerCriteria({ company: { ...company, criteriaAnswers } })
                  }
                  changeCompanyType={(modifiedCompany: CompanyToMove) => {
                    setCompanyToAnswerCriteria({ company: { ...modifiedCompany?.company, criteriaAnswers } });
                    setCompanyToMove(modifiedCompany);
                  }}
                />
              );
            case CompanyType.QUALIFIED:
              return (
                <Supplier
                  buttonLabel={
                    project.status === 'INPROGRESS' || project.status === 'COMPLETED' ? undefined : t('shortlist')
                  }
                  nextType={CompanyType.SHORTLISTED}
                  key={`${company.id}_shortlist`}
                  projectCompany={projectCompany}
                  setCompanyToAnswerCriteria={({ company }: CompanyToMove) =>
                    setCompanyToAnswerCriteria({ company: { ...company, criteriaAnswers } })
                  }
                  changeCompanyType={(modifiedCompany: CompanyToMove) => {
                    setCompanyToAnswerCriteria({ company: { ...modifiedCompany?.company, criteriaAnswers } });
                    setCompanyToMove(modifiedCompany);
                  }}
                />
              );
            case CompanyType.CONSIDERED:
              return (
                <Supplier
                  buttonLabel={
                    project.status === 'INPROGRESS' || project.status === 'COMPLETED' ? undefined : t('qualify')
                  }
                  nextType={CompanyType.QUALIFIED}
                  key={`${company.id}_qualify`}
                  projectCompany={projectCompany}
                  setCompanyToAnswerCriteria={({ company }: CompanyToMove) =>
                    setCompanyToAnswerCriteria({ company: { ...company, criteriaAnswers } })
                  }
                  changeCompanyType={(modifiedCompany: CompanyToMove) => {
                    setCompanyToAnswerCriteria({ company: { ...modifiedCompany?.company, criteriaAnswers } });
                    setCompanyToMove(modifiedCompany);
                  }}
                />
              );
            default:
              return <Supplier key={company.id} projectCompany={projectCompany} childrencompany={suppliers} />;
          }
        });
    }
    return [];
  };

  const updateAnswers = (
    answers: { [key: string]: boolean | null | undefined },
    update?: (cache: any, data: any) => void
  ) => {
    return updateProjectCompanyAnswers({
      variables: {
        projectId: project.id,
        companyId: companyToAnswerCriteria?.company?.id,
        criteriaAnswers: JSON.stringify(answers),
      },
      ...(!!update && { update }),
    });
  };

  return (
    <Box pr="8rem">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        Object.values(CompanyType).map((type) => {
          const companiesJsx = getCurrentCompaniesByTypeJsx(type);
          return (
            <Box key={type}>
              <Box margin="1.5rem 0 1.5rem 0">
                <Text as="h5" textStyle="h5" color="#000" marginBottom={'0.5rem'}>
                  {capitalizeFirstLetter(type)}
                </Text>
                {companiesJsx.length ? (
                  <Stack spacing="1.5rem">{companiesJsx}</Stack>
                ) : (
                  <Text mt="1rem" as="h3" textStyle="h3">
                    {t('None')}
                  </Text>
                )}
              </Box>
              <Divider />
            </Box>
          );
        })
      )}
      <CriteriaCheckModal
        title={getCompanyName(companyToAnswerCriteria?.company)}
        submit={(answers) => {
          if (companyToMove.company && companyToMove.nextType) {
            setDraftAnswers(answers);
          } else {
            updateAnswers(answers, (cache, { data: { answerProjectCriteria } }) => {
              if (answerProjectCriteria.criteriaAnswers) {
                enqueueSnackbar(t('Answers saved'), { status: 'success' });
              }
              setDraftAnswers(null);
              setCompanyToAnswerCriteria(null);
            });
          }
        }}
        isLoading={updatingCompanyAnswers}
        criteria={project.selectionCriteria}
        answers={companyToAnswerCriteria?.company?.criteriaAnswers}
        open={!!companyToAnswerCriteria?.company && project.selectionCriteria?.length > 0 && !draftAnswers}
        onClose={() => setCompanyToAnswerCriteria({})}
      />
      <ChangeCompanyTypeModal
        title={getCompanyName(companyToMove.company)}
        open={!!(companyToMove.action && (!project.selectionCriteria?.length || draftAnswers))}
        isLoading={updatingCompanies}
        action={companyToMove.action}
        onClose={() => {
          setCompanyToMove({});
          setDraftAnswers(null);
          setCompanyToAnswerCriteria(null);
        }}
        submit={async () => {
          if (companyToMove.company && companyToMove.nextType) {
            if (project.selectionCriteria?.length > 0 && draftAnswers) {
              await updateAnswers(draftAnswers);
            }
            updateCompanyType(companyToMove.company, companyToMove.nextType);
          }
        }}
      />
      <Box margin="2rem 0 2rem">
        <StimButton
          id="project-suppliers-button-000"
          onClick={() => navigate('/companies/all/list/1')}
          size="stimSmall"
        >
          {t('Discover')}
        </StimButton>
      </Box>
    </Box>
  );
};

export default ProjectSuppliersTab;
