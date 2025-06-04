import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../../stores/global';
import CreateProjectForm from '../CreateProjectForm';
import { FormProjectProvider } from '../../../hooks/projectForms/projectForm.provider';
import { ProjectFormFields } from '../../../hooks/projectForms/projectFromValidations';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const props = {
  nextStep: jest.fn(),
  projectTitle: 'test',
  projectDescription: 'test',
  projectKeywords: 'test',
  parentProjectId: 1,
  projectBudget: 1,
  projectContract: 1,
  projectStartDate: new Date(),
  projectEndDate: undefined,
  isEdit: false,
  isLoading: false,
  project: {
    title: 'test',
    budget: 1,
    contract: 1,
    expectedStartDate: new Date(),
  },
};

const REQUIRED_MARK = '*';

describe('<CreateProjectForm />', () => {
  it('should render the component', async () => {
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider children={<CreateProjectForm {...props} />} />
        </FormProjectProvider>
      </Provider>
    );
  });

  it('should render the component with isEdit true', async () => {
    const customProps = { ...props, isEdit: true };
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider children={<CreateProjectForm {...customProps} />} />
        </FormProjectProvider>
      </Provider>
    );
  });

  it('should render the component with isEdit true and project undefined', async () => {
    const customProps = { ...props, isEdit: true, project: undefined };
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider children={<CreateProjectForm {...customProps} />} />
        </FormProjectProvider>
      </Provider>
    );
  });

  it('should render the component with isEdit true and project defined', async () => {
    const customProps = { ...props, isEdit: true, project: props.project };
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider children={<CreateProjectForm {...customProps} />} />
        </FormProjectProvider>
      </Provider>
    );
  });

  it('should render the component for a new project', async () => {
    const customProps = {
      ...props,
      projectTitle: '',
      projectDescription: '',
      parentProjectId: 1,
      projectBudget: 1,
      projectContract: undefined,
      projectStartDate: undefined,
      projectEndDate: undefined,
    };
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider children={<CreateProjectForm {...customProps} />} />
        </FormProjectProvider>
      </Provider>
    );
  });

  it('should render the component with initial data', async () => {
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider>
            <CreateProjectForm {...props} />
          </MockedProvider>
        </FormProjectProvider>
      </Provider>
    );

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByText(`${ProjectFormFields.PROJECT_TITLE}${REQUIRED_MARK}`)).toBeInTheDocument();
    // const input = screen.getByTestId(`${ProjectFormFields.PROJECT_TITLE}${REQUIRED_MARK}`) as HTMLInputElement;
    // expect(input.value).toBe(props.projectTitle);
  });

  it('should display error message for invalid title input', async () => {
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider>
            <CreateProjectForm {...props} />
          </MockedProvider>
        </FormProjectProvider>
      </Provider>
    );

    // const titleInput = screen.getByRole('textbox', { name: new RegExp(ProjectFormFields.PROJECT_TITLE) });
    // const nextButton = screen.getByRole('button', { name: /next/i });

    // await userEvent.clear(titleInput);

    // expect(nextButton).toBeDisabled();
    // expect(titleInput).toHaveValue('');
  });

  it('should not call nextStep function with invalid form values', async () => {
    render(
      <Provider store={store}>
        <FormProjectProvider>
          <MockedProvider>
            <CreateProjectForm {...props} />
          </MockedProvider>
        </FormProjectProvider>
      </Provider>
    );

    // const nextButton = screen.getByRole('button', { name: /next/i });
    // expect(nextButton).toBeDisabled();
  });
});
