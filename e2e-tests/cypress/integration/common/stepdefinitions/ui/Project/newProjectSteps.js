import { getVariable, setVariable } from './../../../../../utils/Context';
import { getNameRandom, getNumber } from './../../../../../plugins/DataGenerator';
import ProjectPage from '../../../../pages/Project/ProjectPage';
import NewProjectPage from '../../../../pages/Project/NewProjectPage';
import ProjectHomePage from '../../../../pages/Project/ProjectHomePage';
import HomePage from '../../../../pages/HomePage';

const { PROJECT_NAME } = require('../../../../../utils/CommonVariables');
const homePage = new HomePage();
const newProjectPage = new NewProjectPage();
const projectHomePage = new ProjectHomePage();
const projectPage = new ProjectPage();

And('is on the projects page', () => {
  homePage.goProjectsSection();
});

When('the user press the new project button', () => {
  projectHomePage.clickOnNewProjectBtn();
});

When('the user enters a project', () => {
  let project_name = getNameRandom();
  setVariable(PROJECT_NAME, project_name);
  projectHomePage.clickOnNewProjectBtn();
  newProjectPage.inputTitleProject(project_name);
  newProjectPage.inputStartDate('07/12/2023');
  newProjectPage.inputEndDate('07/12/2023');
  newProjectPage.inputDescription('Description');
  newProjectPage.inputProjectID(getNumber());
  newProjectPage.inputProjectBudget(getNumber());
  newProjectPage.clickOnContinueBtn();
  newProjectPage.skipSelectionCriteria();
  projectPage.validateProjectLoaded();
});

And('fills the new project fields', (datatable) => {
  let data = datatable.hashes()[0];
  let project_name;
  if (data.title !== '') {
    project_name = data.title + getNumber();
    setVariable(PROJECT_NAME, project_name);
  }
  newProjectPage.inputTitleProject(project_name);
  newProjectPage.inputStartDate(data.start_date);
  newProjectPage.inputEndDate(data.end_date);
  newProjectPage.inputDescription(data.description);
  newProjectPage.inputProjectID(data.project_id);
  newProjectPage.inputProjectBudget(data.project_budget);
  newProjectPage.inputKeywords(data.keywords);
});

And('press the button to continue with the creation of the project', () => {
  newProjectPage.clickOnContinueBtn();
  newProjectPage.skipSelectionCriteria();
});

Then('the project is created correctly', () => {
  const project_name = getVariable(PROJECT_NAME);
  newProjectPage.validateProject(project_name);
});

Then('Continue button is disabled', () => {
  newProjectPage.validateContinueBtnDisabled();
});
