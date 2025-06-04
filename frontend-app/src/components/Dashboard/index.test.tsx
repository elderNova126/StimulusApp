import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import Dashboard from '../Dashboard/Dashboard';
import MyActivityLog from './ActivityLogs/MyActivityLog';
import TenantActivityLog from './ActivityLogs/TenantActivityLog';
import ChartDash from './ChartDash';
import RecentProjects from './RecentProjects';
import { render } from '../../test-utils';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('react-plotly.js', () => ({
  __esModule: true,
  default: jest.fn(() => <div />),
}));

const event: any = [
  {
    body: 'Status of project test with id: 3249 was set to INPROGRESS',
    code: 'UPDATE_PROJECT_STATUS',
    created: 'Mon Jan 30 2023 17:04:55 GMT+0000 (Coordinated Universal Time)',
    entityId: '3249',
    entityType: 'PROJECT',
    id: 6704,
    meta: {
      actionType: 'UPDATE',
      answers: null,
      companyId: null,
      companyName: null,
      departmentId: null,
      departmentName: null,
      listId: null,
      listName: null,
      projectId: '3249',
      projectName: 'test',
      setting: null,
      settingValue: null,
      status: 'INPROGRESS',
      type: null,
      updates: null,
      userName: null,
    },
    userId: '3a50b153-2a3c-41c9-9c0e-890b6320ef44',
    userName: null,
  },
];

const project: any = [
  {
    description: '',
    endDate: null,
    expectedEndDate: null,
    expectedStartDate: 'Tue Jan 17 2023 00:00:00 GMT+0000 (Coordinated Universal Time)',
    id: 3249,
    projectCompany: [
      {
        company: {
          __typename: 'Company',
          doingBusinessAs: 'University of Pennsylvania',
          id: '913C6CBA-BACF-EC11-997E-0003FFD75239',
          legalBusinessName: 'University of Pennsylvania',
        },
        id: 6608,
        type: 'CLIENT',
      },
      {
        company: {
          __typename: 'Company',
          doingBusinessAs: '(mt) Media Temple',
          id: '3C1BF5F1-6B29-ED11-AE83-A04A5E8158B2',
          legalBusinessName: 'Media Temple, Inc. test',
        },
        id: 6609,
        type: 'AWARDED',
      },
    ],
    startDate: 'Tue Jan 17 2023 00:00:00 GMT+0000 (Coordinated Universal Time)',
    status: 'INPROGRESS',
    targetScore: null,
    title: 'test',
  },
];

test('Should render complete dashboard', async () => {
  const view = render(
    <MockedProvider>
      <Provider store={store} children={<Dashboard />} />
    </MockedProvider>
  );
  expect(view).toBeDefined();
});

test('Should render chart', async () => {
  render(
    <MockedProvider>
      <Provider store={store} children={<Dashboard />} />
    </MockedProvider>
  );
  expect(<ChartDash qty={1} type={'COMPANIES'} />).toBeDefined();
});

test('Should render user activity log', async () => {
  render(
    <MockedProvider>
      <Provider store={store} children={<Dashboard />} />
    </MockedProvider>
  );
  expect(<MyActivityLog loading={false} events={event} />).toBeDefined();
});

test('Should render tenant activity log', async () => {
  render(
    <MockedProvider>
      <Provider store={store} children={<Dashboard />} />
    </MockedProvider>
  );
  expect(<TenantActivityLog loading={false} events={event} />).toBeDefined();
});

test('Should render projects', async () => {
  render(
    <MockedProvider>
      <Provider store={store} children={<Dashboard />} />
    </MockedProvider>
  );
  expect(<RecentProjects count={1} loading={false} projects={project} />).toBeDefined();
});
