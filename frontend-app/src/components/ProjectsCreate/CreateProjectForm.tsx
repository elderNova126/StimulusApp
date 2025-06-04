import { FC, useContext, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CreateProjectInput from './CreateProjectInput';
import CreateProjectImage from './CreateProjectImage';
import CreateProjectDatePicker from './CreateProjectDatePicker';
import { useDispatch } from 'react-redux';
import {
  setProjectTitle,
  setProjectDescription,
  setProjectKeywords,
  setProjectContract,
  setProjectBudget,
  setParentProjectId,
} from '../../stores/features/projects';
import { FormProjectContext } from '../../hooks/projectForms/projectForm.provider';
import { ProjectFormFields } from '../../hooks/projectForms/projectFromValidations';
import FormErrorsMessage from '../GenericComponents/FormErrorsMessage';
import { handleErrorFromAlerts, useStimulusToast, cleanAndFormatString, numberInputSanitizer } from '../../hooks';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import StimButton from '../ReusableComponents/Button';
interface CreateNewProjectProps {
  nextStep: () => void;
  projectTitle: string;
  projectDescription: string;
  projectKeywords: string;
  parentProjectId: number | undefined;
  projectBudget: number | undefined;
  projectContract: number | undefined;
  projectStartDate: Date | undefined | null;
  projectEndDate: Date | undefined | null;
  isEdit: boolean;
  isLoading: boolean;
  project?: any;
}

const CreateProjectForm: FC<CreateNewProjectProps> = ({
  nextStep,
  projectTitle,
  projectDescription,
  projectKeywords,
  parentProjectId,
  projectBudget,
  projectContract,
  projectStartDate,
  projectEndDate,
  isEdit,
  isLoading,
  project,
}) => {
  const { formMethods } = useContext(FormProjectContext)!;
  const { register, errors, setValue, trigger, watch } = formMethods;
  const { t } = useTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const dispatch = useDispatch();
  const REQUIRED_MARK = '*';
  useEffect(() => {
    if (!!project && isEdit) {
      setValue(ProjectFormFields.PROJECT_TITLE, project.title, { shouldValidate: true });
      setValue(ProjectFormFields.BUDGET, project.budget, { shouldValidate: true });
      setValue(ProjectFormFields.PROJECT_ID_CONTRACT_NO, project.contract, { shouldValidate: true });
      setValue(ProjectFormFields.PROJECT_START_DATE, new Date(project.expectedStartDate), { shouldValidate: true });
    }
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  const listOfEvents = {
    [ProjectFormFields.BUDGET]: setProjectBudget,
    [ProjectFormFields.KEYWORDS]: setProjectKeywords,
    [ProjectFormFields.PROJECT_TITLE]: setProjectTitle,
    [ProjectFormFields.PARENT_PROJECT_ID]: setParentProjectId,
    [ProjectFormFields.PROJECT_DESCRIPTION]: setProjectDescription,
    [ProjectFormFields.PROJECT_ID_CONTRACT_NO]: setProjectContract,
  };
  const checkRequiredFields = () => {
    const requiredFields = [
      ProjectFormFields.PROJECT_TITLE,
      ProjectFormFields.BUDGET,
      ProjectFormFields.PROJECT_START_DATE,
    ];
    const fields = watch(requiredFields);
    const fieldsAreEmpty = Object.values(fields).map((field) => !!field);
    const isAnyFieldEmpty = !fieldsAreEmpty.some((field) => field === false);
    return isAnyFieldEmpty;
  };

  const handleValue = (field: string, value: any) => {
    const event = listOfEvents[field as keyof typeof listOfEvents];
    dispatch(event(value as never));
    setValue(field, value, { shouldValidate: true });
  };
  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      return nextStep();
    }
    handleErrorFromAlerts({ errors, enqueueSnackbar, showErros: false });
  };

  return (
    <Box ml="2rem">
      <Text as="h1" textStyle="h1" pb="2rem" id="header-text-project">
        {isEdit ? t(`Edit project`) : t('Create New Project')}
      </Text>
      <Flex zIndex={1} w="75vw">
        <Box w="45%">
          <Text as="h3" textStyle="h3" pb="2rem">
            {isEdit
              ? t(
                  'Modify your project info here. Press Save when completed or press Back to cancel your changes. Field prefixed with * are optional'
                )
              : t('To start we need some basic information to create a new project')}
          </Text>
          <Text as="h3" textStyle="h3" fontStyle="italic">
            {t('Field prefixed with * are mandatory')}
          </Text>
          <CreateProjectInput
            name={ProjectFormFields.PROJECT_TITLE}
            isLoading={isLoading}
            labelText={ProjectFormFields.PROJECT_TITLE + REQUIRED_MARK}
            inputValue={projectTitle}
            isInvalid={!!errors?.[ProjectFormFields.PROJECT_TITLE]}
            {...register(ProjectFormFields.PROJECT_TITLE)}
            onChange={(newTitle: string) =>
              handleValue(ProjectFormFields.PROJECT_TITLE, cleanAndFormatString(newTitle))
            }
          />
          <FormErrorsMessage
            id={ProjectFormFields.PROJECT_TITLE}
            errorMessage={errors[ProjectFormFields.PROJECT_TITLE]?.message}
          />
          <CreateProjectDatePicker
            isLoading={isLoading}
            projectStartDate={projectStartDate}
            projectEndDate={projectEndDate}
          />
          <CreateProjectInput
            name={ProjectFormFields.PROJECT_DESCRIPTION}
            isLoading={isLoading}
            labelText={t(ProjectFormFields.PROJECT_DESCRIPTION)}
            isMultiline={true}
            inputValue={projectDescription}
            isInvalid={!!errors?.[ProjectFormFields.PROJECT_DESCRIPTION]}
            {...register(ProjectFormFields.PROJECT_DESCRIPTION)}
            onChange={(newDescription: string) => handleValue(ProjectFormFields.PROJECT_DESCRIPTION, newDescription)}
          />
          <FormErrorsMessage
            id={ProjectFormFields.PROJECT_DESCRIPTION}
            errorMessage={errors[ProjectFormFields.PROJECT_DESCRIPTION]?.message}
          />
          <CreateProjectInput
            name={ProjectFormFields.PROJECT_ID_CONTRACT_NO}
            labelText={t(ProjectFormFields.PROJECT_ID_CONTRACT_NO)}
            isLoading={isLoading}
            inputValue={projectContract}
            isInvalid={!!errors?.[ProjectFormFields.PROJECT_ID_CONTRACT_NO]}
            {...register(ProjectFormFields.PROJECT_ID_CONTRACT_NO)}
            onChange={(newContractNo: string) =>
              handleValue(ProjectFormFields.PROJECT_ID_CONTRACT_NO, numberInputSanitizer(newContractNo))
            }
            onBlur={(newContractNo: string) =>
              handleValue(ProjectFormFields.PROJECT_ID_CONTRACT_NO, numberInputSanitizer(newContractNo))
            }
          />
          <FormErrorsMessage
            id={ProjectFormFields.PROJECT_ID_CONTRACT_NO}
            errorMessage={errors[ProjectFormFields.PROJECT_ID_CONTRACT_NO]?.message}
          />
          <CreateProjectInput
            name={ProjectFormFields.BUDGET}
            labelText={t(ProjectFormFields.BUDGET + REQUIRED_MARK)}
            isLoading={isLoading}
            inputValue={projectBudget}
            isInvalid={!!errors?.[ProjectFormFields.BUDGET]}
            {...register(ProjectFormFields.BUDGET)}
            onChange={(budget) => handleValue(ProjectFormFields.BUDGET, numberInputSanitizer(budget))}
            onBlur={(budget: string) => handleValue(ProjectFormFields.BUDGET, numberInputSanitizer(budget))}
          />
          <FormErrorsMessage id={ProjectFormFields.BUDGET} errorMessage={errors[ProjectFormFields.BUDGET]?.message} />
          <CreateProjectInput
            isLoading={isLoading}
            labelText={t('Keywords')}
            inputValue={projectKeywords}
            isInvalid={!!errors?.[ProjectFormFields.KEYWORDS]}
            {...register(ProjectFormFields.KEYWORDS)}
            onChange={(newKeywords: string) => handleValue(ProjectFormFields.KEYWORDS, newKeywords)}
          />
          <FormErrorsMessage
            id={ProjectFormFields.KEYWORDS}
            errorMessage={errors[ProjectFormFields.KEYWORDS]?.message}
          />
          <CreateProjectInput
            name={ProjectFormFields.PARENT_PROJECT_ID}
            isLoading={isLoading}
            labelText={t(ProjectFormFields.PARENT_PROJECT_ID)}
            inputValue={parentProjectId}
            isInvalid={!!errors?.[ProjectFormFields.PARENT_PROJECT_ID]}
            {...register(ProjectFormFields.PARENT_PROJECT_ID)}
            onChange={(parentProjectId: string) =>
              handleValue(ProjectFormFields.PARENT_PROJECT_ID, numberInputSanitizer(parentProjectId))
            }
            onBlur={(parentProjectId: string) =>
              handleValue(ProjectFormFields.PARENT_PROJECT_ID, numberInputSanitizer(parentProjectId))
            }
          />
          <FormErrorsMessage
            id={ProjectFormFields.PARENT_PROJECT_ID}
            errorMessage={errors[ProjectFormFields.PARENT_PROJECT_ID]?.message}
          />
          <StimButton
            id="next-step-button"
            m="2rem 0 2rem 0"
            size="stimSmall"
            {...(checkRequiredFields()
              ? { colorScheme: 'green', cursor: 'pointer' }
              : { disabled: true, cursor: 'not-allowed' })}
            onClick={handleNextStep}
          >
            {t('Continue')}
          </StimButton>
        </Box>
        <CreateProjectImage />
      </Flex>
    </Box>
  );
};

export default withLDConsumer()(CreateProjectForm) as any;
