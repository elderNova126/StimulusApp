import { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CompanyType } from '../Company/company.types';
import ProjectEvaluation from '../ProjectEvaluation';
import { Box } from '@chakra-ui/react';
import ProjectEvaluationPerformance, { PerformanceState } from '../ProjectEvaluationPerformance';
import { useStimulusToast } from '../../hooks';
import * as R from 'ramda';
import { ProjectCompanyModel } from '../ProjectEvaluation/evaluation.interface';
import { setTrueHasNewEvaluation } from '../../stores/features/projects';
import { useDispatch } from 'react-redux';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import EvaluationQueries from '../../graphql/Queries/EvaluationQueries';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import { setHoursToZero } from '../../utils/date';
import LoadingScreen from '../LoadingScreen';

const { SEARCH_PROJECT_COMPANIES } = ProjectQueries;
const { PROJECT_EVALUATION } = EvaluationQueries;
const { COMPANY_DETAILS_GQL } = CompanyQueries;

const { EVALUATE_COMPANY, UPDATE_COMPANY_EVALUATION } = CompanyMutations;
interface Props {
  projectId: number;
  searchProjectCompaniesData: any;
  loading: boolean;
}

const ProjectEvaluations: FC<Props> = ({ projectId, searchProjectCompaniesData, loading }) => {
  const dispatch = useDispatch();
  const [selectedCompanyForEvaluation, setSelectedCompanyForEvaluation] = useState<ProjectCompanyModel | null>(null);
  const { data: projectEvaluationData } = useQuery(PROJECT_EVALUATION, {
    variables: { projectId },
    fetchPolicy: 'cache-first',
  });
  const [saveEvaluationMutation] = useMutation(EVALUATE_COMPANY);
  const [updateCompanyEvaluationMutation] = useMutation(UPDATE_COMPANY_EVALUATION);
  const { enqueueSnackbar } = useStimulusToast();

  const searchAwardedProjectCompaniesResults = searchProjectCompaniesData?.searchProjectCompanies?.results || [];
  const companyEvaluationMetrics = projectEvaluationData?.projectEvaluation?.metrics;
  const saveEvaluation = (state: PerformanceState, budgetSpend: number, description: string, evaluationDate: Date) => {
    saveEvaluationMutation({
      variables: {
        projectCompanyId: selectedCompanyForEvaluation?.id,
        projectId,
        budgetSpend,
        description,
        evaluationDate,
        ...state,
      },
      refetchQueries: [{ query: COMPANY_DETAILS_GQL, variables: { id: selectedCompanyForEvaluation?.companyId } }],
      update: (cache, { data: { evaluateCompany } }) => {
        const { searchProjectCompanies } = R.clone(
          cache.readQuery({
            query: SEARCH_PROJECT_COMPANIES,
            variables: { projectId, companyType: CompanyType.Awarded },
          })
        ) as any;
        const updatedSearchProjectCompaniesResults = searchProjectCompanies.results.map(
          (result: ProjectCompanyModel) => {
            if (result.id === selectedCompanyForEvaluation?.id) {
              result.evaluations = [evaluateCompany];
            }
            return result;
          }
        );
        searchProjectCompanies.results = updatedSearchProjectCompaniesResults;
        cache.writeQuery({
          query: SEARCH_PROJECT_COMPANIES,
          variables: { projectId, companyType: CompanyType.Awarded },
          data: { searchProjectCompanies: { ...searchProjectCompanies } },
        });
        enqueueSnackbar(`Evaluated successfully`, { status: 'success' });
        dispatch(setTrueHasNewEvaluation());
        setSelectedCompanyForEvaluation(null);
      },
    });
  };

  const updateEvaluation = (
    id: number,
    state: PerformanceState,
    budgetSpend: number,
    description: string,
    evaluationDate: Date
  ) => {
    const results = searchProjectCompaniesData?.searchProjectCompanies ?? [];
    const startDate = results[0]?.project?.startDate;
    const currentDate = new Date();

    if (evaluationDate) {
      const newEvaluationDate = setHoursToZero(new Date(evaluationDate));
      const newStartDate = setHoursToZero(new Date(startDate));
      if (newEvaluationDate < newStartDate || newEvaluationDate > currentDate) {
        enqueueSnackbar(`Evaluation date should be between project start date and current date`, { status: 'error' });
        return null;
      }
    }
    updateCompanyEvaluationMutation({
      variables: {
        id,
        projectCompanyId: selectedCompanyForEvaluation?.id,
        projectId,
        budgetSpend,
        description,
        evaluationDate,
        ...state,
      },
      refetchQueries: [{ query: COMPANY_DETAILS_GQL, variables: { id: selectedCompanyForEvaluation?.companyId } }],
      update: (cache, { data: { updateCompanyEvaluation } }) => {
        enqueueSnackbar(`Company evaluation updated successfully`, { status: 'success' });
        setSelectedCompanyForEvaluation(null);
      },
    });
  };

  return (
    <Box padding="0rem 8rem 2rem 0rem">
      {loading ? (
        <LoadingScreen />
      ) : selectedCompanyForEvaluation ? (
        <ProjectEvaluationPerformance
          selectedCompanyForEvaluation={selectedCompanyForEvaluation}
          metrics={companyEvaluationMetrics}
          saveEvaluation={saveEvaluation}
          updateEvaluation={updateEvaluation}
          onChangeSelectedCompany={setSelectedCompanyForEvaluation}
          defaultProjectEvaluationBudget={Math.round(
            searchAwardedProjectCompaniesResults[0].project.budget / searchAwardedProjectCompaniesResults.length || 0
          )}
        />
      ) : (
        searchAwardedProjectCompaniesResults.map((projectCompany: any, index: number) => (
          <ProjectEvaluation
            key={`projectEvaluation-${index}`}
            projectCompany={projectCompany}
            onSelect={() => setSelectedCompanyForEvaluation(projectCompany)}
          />
        ))
      )}
    </Box>
  );
};

export default ProjectEvaluations;
