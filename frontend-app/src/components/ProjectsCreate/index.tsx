import { useLazyQuery, useMutation } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { navigate, RouteComponentProps } from '@reach/router';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectStatus } from '../../graphql/enums';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import {
  ProjectsState,
  resetProjectFormState,
  setProjectBudget,
  setProjectContract,
  setProjectDescription,
  setProjectEndDate,
  setProjectKeywords,
  setProjectSelectionCriteria,
  setProjectStartDate,
  setProjectTitle,
} from '../../stores/features/projects';
import * as R from 'ramda';

import NotFound from '../NotFound';
import CreateProjectForm from './CreateProjectForm';
import ProvideSupplierCriteria from './ProvideSupplierCriteria';
import { FormProjectProvider } from '../../hooks/projectForms/projectForm.provider';

enum CreateProjectSteps {
  CreateProjectForm,
  ProvideSupplierCriteria,
}

const { CREATE_PROJECT_GQL, UPDATE_PROJECT_GQL } = ProjectMutations;
const { PROJECT_DETAILS_GQL, AVAILABLE_PROJECTS_GQL } = ProjectQueries;

interface Params {
  projectId?: any;
}

const ProjectsCreate = (props: RouteComponentProps & Params) => {
  let { projectId } = props;
  const isProjectIdAvailable = !!projectId;
  projectId = parseInt(projectId, 10);

  const [currentStep, setCurrentStep] = useState<CreateProjectSteps>(CreateProjectSteps.CreateProjectForm);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const projectTitle: string = useSelector((state: { projects: ProjectsState }) => state.projects?.projectTitle);
  const projectParentId: number | undefined = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectParentId
  );
  const projectDescription: string = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectDescription
  );
  const projectKeywords: string = useSelector((state: { projects: ProjectsState }) => state.projects?.projectKeywords);
  const projectBudget: number | undefined = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectBudget
  );
  const projectContract: number | undefined = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectContract
  );
  const projectStartDate: Date | undefined = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectStartDate
  );
  const projectEndDate: Date | undefined = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectEndDate
  );
  const [saveProject] = useMutation(CREATE_PROJECT_GQL);
  const [updateProject] = useMutation(UPDATE_PROJECT_GQL);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const [getProjectDetails, { loading: loadingProject, data }] = useLazyQuery(PROJECT_DETAILS_GQL(projectId), {
    fetchPolicy: 'cache-first',
  });
  const project = data?.searchProjects?.results[0];

  useEffect(() => {
    if (isProjectIdAvailable) {
      getProjectDetails();
    }
  }, [getProjectDetails, isProjectIdAvailable]);

  useEffect(() => {
    if (project) {
      dispatch(setProjectTitle(project.title));
      dispatch(setProjectDescription(project.description));
      dispatch(setProjectKeywords(project.keywords));
      dispatch(setProjectContract(project.contract));
      dispatch(setProjectBudget(project.budget));
      if (project.expectedStartDate) {
        dispatch(setProjectStartDate(new Date(project.expectedStartDate)));
      }
      if (project.expectedEndDate) {
        dispatch(setProjectEndDate(new Date(project.expectedEndDate)));
      }
      dispatch(setProjectSelectionCriteria(project.selectionCriteria));
    }
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSaveProject = (withCriteria: boolean, selectionCriteria: string[]) => {
    setLoading(true);
    saveProject({
      variables: {
        title: projectTitle,
        description: projectDescription,
        keywords: projectKeywords,
        contract: projectContract,
        expectedStartDate: projectStartDate?.toISOString(),
        parentProjectTreeId: projectParentId,
        ...(projectEndDate && { expectedEndDate: projectEndDate.toISOString() }),
        budget: projectBudget,
        ...(withCriteria && selectionCriteria.length > 0 && { selectionCriteria: selectionCriteria }),
      },
      update: (cache, { data: { createProject } }) => {
        if (!createProject || createProject.error) {
          setLoading(false);
          return enqueueSnackbar(errTranslations[createProject.code], { status: 'error' });
        }
        enqueueSnackbar(`Project ${createProject.title} created.`, { status: 'success' });
        dispatch(resetProjectFormState());

        const { searchProjects } = R.clone(
          cache.readQuery({ query: AVAILABLE_PROJECTS_GQL() }) ?? { searchProjects: { results: [] } }
        ) as any;
        searchProjects.results = [...(searchProjects?.results || []), createProject];
        cache.writeQuery({
          query: AVAILABLE_PROJECTS_GQL(),
          data: { searchProjects },
        });
        setLoading(false);
        navigate(`/project/${createProject.id}`);
      },
    });
  };

  const onUpdateProject = (withCriteria: boolean, selectionCriteria: string[]) => {
    setLoading(true);
    updateProject({
      variables: {
        id: project.id,
        title: projectTitle,
        expectedStartDate: projectStartDate ? projectStartDate.toISOString() : '',
        ...(projectEndDate && { expectedEndDate: projectEndDate.toISOString() }),
        description: projectDescription,
        contract: projectContract,
        budget: projectBudget,
        keywords: projectKeywords,
        parentProjectTreeId: projectParentId,
        ...(withCriteria && {
          selectionCriteria: selectionCriteria,
        }),
      },
      update: (_, { data: { updateProject } }) => {
        if (!updateProject || updateProject.error) {
          let message = `There was an error. Please try again`;
          if (updateProject.code === 14) {
            if (!project.ongoing) {
              message = `Project is on hold! You need to resume project to make any change!`;
            } else if (project.status === ProjectStatus.CANCELED) {
              message = `Project is canceled! You cannot change a canceled project`;
            }
          }
          enqueueSnackbar(message, { status: 'error' });
          setLoading(false);
          navigate(`/project/${projectId}`);
        } else {
          const { id } = updateProject;
          enqueueSnackbar(`Project updated`, { status: 'success' });
          setLoading(false);
          navigate(`/project/${id}`);
        }
      },
    });
  };

  if (isProjectIdAvailable && isNaN(projectId)) {
    return <NotFound />;
  }

  return (
    <FormProjectProvider>
      <Box p="7rem 0 0 4rem">
        {currentStep === CreateProjectSteps.ProvideSupplierCriteria ? (
          <ProvideSupplierCriteria
            isEdit={!!projectId}
            isLoading={loadingProject}
            loading={loading}
            saveProject={projectId ? onUpdateProject : onSaveProject}
          />
        ) : (
          <CreateProjectForm
            isLoading={loadingProject}
            isEdit={!!projectId}
            nextStep={() => setCurrentStep(CreateProjectSteps.ProvideSupplierCriteria)}
            projectTitle={projectTitle}
            projectDescription={projectDescription}
            projectStartDate={projectStartDate}
            projectEndDate={projectEndDate}
            parentProjectId={projectParentId}
            projectContract={projectContract}
            projectBudget={projectBudget}
            projectKeywords={projectKeywords}
            project={project}
          />
        )}
      </Box>
    </FormProjectProvider>
  );
};

export default ProjectsCreate;
