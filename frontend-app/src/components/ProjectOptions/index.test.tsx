import { render, screen } from '@testing-library/react';
import DeleteProjectModal from './DeleteProjectModal';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
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
test('Should render delete modal', async () => {
  const view = render(
    <MockedProvider>
      <Provider
        store={store}
        children={<DeleteProjectModal isOpen={true} setIsOpen={() => true} project={project} />}
      />
    </MockedProvider>
  );
  expect(view).toBeDefined();
});
describe('Modal delete project component', () => {
  test('Should render title', async () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<DeleteProjectModal isOpen={true} setIsOpen={() => true} project={project} />} />
      </Provider>
    );
    expect(
      screen.getByText((_, element: any) => element.textContent === 'Are you sure you wish to delete?')
    ).toBeInTheDocument();
  });
});
