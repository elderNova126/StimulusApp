import { Box, Collapse, Divider, Flex, Input, SlideFade, Stack, Text, Textarea } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MetricModel, ProjectCompanyModel } from '../ProjectEvaluation/evaluation.interface';
import ProjectEvaluationPerformanceMetric, { PerformanceMetricSlider } from '../ProjectEvaluationPerformanceMetric';
import { CompanyDateEditField } from '../Company/shared';
import { FormCompanyProvider } from '../../hooks/companyForms/companyForm.provider';
import { useForm } from 'react-hook-form';
import { BUDGET_SPENT, ValidationCommendSchema } from './EvaluationSchemaValidation';
import FormErrorsMessage from '../GenericComponents/FormErrorsMessage';
import StimButton from '../ReusableComponents/Button';
import { ChevronLeftIcon } from '@chakra-ui/icons';
export interface PerformanceState {
  quality: number;
  reliability: number;
  features: number;
  cost: number;
  relationship: number;
  financial: number;
  diversity: number;
  innovation: number;
  flexibility: number;
  brand: number;
}
const ProjectEvaluationPerformance = (props: {
  selectedCompanyForEvaluation: ProjectCompanyModel;
  metrics: MetricModel[];
  onChangeSelectedCompany: (selectedProjectEvaluation: any) => void;
  saveEvaluation: (state: PerformanceState, budgetSpend: number, description: string, evaluationDate: Date) => void;
  updateEvaluation: (
    id: number,
    state: PerformanceState,
    budgetSpend: number,
    description: string,
    evaluationDate: Date
  ) => void;
  defaultProjectEvaluationBudget: number;
}) => {
  const [showToggleBtn, setShowToggleBtn] = useState(false);
  const { t } = useTranslation();
  const {
    selectedCompanyForEvaluation,
    metrics,
    onChangeSelectedCompany,
    saveEvaluation,
    defaultProjectEvaluationBudget,
  } = props;
  const { evaluations } = selectedCompanyForEvaluation;
  const evaluation = evaluations?.[0];
  const [budgetSpend, setBudgetSpend] = useState<number>(evaluation?.budgetSpend ?? defaultProjectEvaluationBudget);
  const [description, setDescription] = useState<string>(evaluation?.description ?? '');
  const [globalRatingValue, setGlobalRatingValue] = useState<number>(0);
  const isEvaluationDisabled = false;

  const [newEvaluationDate, setNewEvaluationDate] = useState<Date | null>(
    evaluation?.created ? new Date(evaluation.created) : null
  );
  const evaluationTyped = useMemo(() => newEvaluationDate, [newEvaluationDate]);

  const { register, setValue, errors } = useForm({
    resolver: ValidationCommendSchema,
  });

  const defaultPerformanceState: PerformanceState = {
    quality: 0,
    reliability: 0,
    features: 0,
    cost: 0,
    relationship: 0,
    financial: 0,
    diversity: 0,
    innovation: 0,
    flexibility: 0,
    brand: 0,
  };
  const [state, setState] = useState<PerformanceState>(defaultPerformanceState);

  const onPerformanceMetricChange = (metricName: string, value: number) => {
    setState({ ...state, [metricName]: value });
  };

  const onDescriptionChange = (event: any) => {
    const value = event?.target.value;
    setDescription(value);
  };

  return (
    <FormCompanyProvider>
      <Box data-testid="projectEvaluationPerformance-container" mt="1rem">
        <StimButton
          leftIcon={<ChevronLeftIcon fontSize="medium" />}
          onClick={() => onChangeSelectedCompany(null)}
          size="stimSmall"
          data-testid="evaluation-cancel-button"
          id="evaluation-cancel-button-001"
        >
          {t('Close')}
        </StimButton>
        <Stack justifyContent="center" alignItems="center" spacing={3}>
          <Text as="h2" textStyle="h2" fontWeight="500">
            {t('Performance Evaluation')}
          </Text>
          <SlideFade in={!evaluation} offsetY="20px">
            <Stack justifyContent="center" alignItems="center" spacing={3}>
              <Text textStyle="h6">
                {t(
                  `Please rate ${selectedCompanyForEvaluation.company?.legalBusinessName}'s performance. If you wish to only provide one overall rating. Click on "Apply One Rating for All Categories".`
                )}
              </Text>
              <Box
                data-testid="box-element"
                onMouseEnter={() => !evaluation && setShowToggleBtn(true)}
                onMouseLeave={() => setShowToggleBtn(false)}
              >
                <Text color="green.600" textStyle="h2" as="h2" data-testid="evaluation-apply-one-rating">
                  {t('Apply One Rating for All Categories')}
                </Text>
                <Collapse in={showToggleBtn}>
                  <Box p="10px">
                    <PerformanceMetricSlider
                      value={globalRatingValue}
                      isDisabled={isEvaluationDisabled}
                      onMetricChange={(value) => {
                        setGlobalRatingValue(value);
                        const newState = Object.keys(state).reduce(
                          (acc, curr) => ({ ...acc, [curr]: value }),
                          {} as any
                        );
                        setState(newState);
                      }}
                    />
                  </Box>
                </Collapse>
              </Box>
            </Stack>
          </SlideFade>
        </Stack>
        <Flex justifyContent="space-between" mt="2rem">
          <Flex justifyContent="space-between" w="400px">
            <Box flex="1">
              <Text textAlign="center" textStyle="h5" fontWeight="500" color="red">
                {t('Did not Meet Expectations')}
              </Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center" textStyle="h5" fontWeight="500" color="blue.200">
                {t('Met Expectations')}
              </Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center" textStyle="h5" fontWeight="500" color="green.600">
                {t('Exceeded all Expectations ')}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Divider />
        {metrics?.map((metric: any, index: number) => (
          <ProjectEvaluationPerformanceMetric
            key={`projectEvalPerfMetric-${index}`}
            metric={metric}
            metricValue={state[metric.keyId as keyof PerformanceState] || 0}
            onMetricChange={onPerformanceMetricChange}
            isDisabled={isEvaluationDisabled}
          />
        ))}

        <Stack spacing={2}>
          <Stack spacing={1}>
            <Text textStyle="h5" as="h5">
              {t('Actual Spend')}
            </Text>
            <>
              {' '}
              <Input
                data-testid="project-evaluation-actual-spend"
                name="actualSpend"
                variant="outline"
                value={budgetSpend || ''}
                fullWidth
                type="number"
                max={1111}
                {...register(BUDGET_SPENT)}
                onChange={(e) => {
                  if (!isNaN(Number(e?.target.value))) {
                    setBudgetSpend(Number(e?.target.value));
                    setValue(BUDGET_SPENT, Number(e?.target.value), { shouldValidate: true });
                  } else {
                    setBudgetSpend(0);
                    setValue(BUDGET_SPENT, 0, { shouldValidate: true });
                  }
                }}
                disabled={isEvaluationDisabled}
              />
              <FormErrorsMessage errorMessage={errors?.[BUDGET_SPENT]?.message} />
            </>
          </Stack>
          {evaluation?.created && (
            <Stack spacing={1}>
              <Text textStyle="h5" as="h5">
                {t('EVALUATION DATE')}
              </Text>
              <Box w={'17%'}>
                <CompanyDateEditField
                  disabled={isEvaluationDisabled}
                  date={evaluationTyped ?? new Date()}
                  setDate={setNewEvaluationDate}
                />
              </Box>
            </Stack>
          )}
          <Stack spacing={1}>
            <Text textStyle="h5" as="h5">
              {t('Comments')}
            </Text>
            <Textarea
              minH="200px"
              value={description}
              onChange={onDescriptionChange}
              data-testid="project-evaluation-comment"
            />
          </Stack>
          <Flex direction="row-reverse">
            {!isEvaluationDisabled && (
              <StimButton
                size="stimSmall"
                disabled={!!Object?.keys(errors?.[BUDGET_SPENT] ?? {})?.length}
                onClick={() =>
                  saveEvaluation(state, budgetSpend, description, newEvaluationDate ? newEvaluationDate : new Date())
                }
                data-testid="project-evaluation-save"
              >
                {t('SAVE')}
              </StimButton>
            )}
          </Flex>
        </Stack>
      </Box>
    </FormCompanyProvider>
  );
};

export default ProjectEvaluationPerformance;
