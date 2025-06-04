import { render, screen } from '@testing-library/react';
import ProjectsListFilters from '.';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('CompaniesMapTable component', () => {
  const accessType = ['Owner', 'Collaborator'];
  const date = ['Start', 'End'];

  test('Render filters component', async () => {
    const view = render(
      <MockedProvider>
        <Provider
          store={store}
          children={
            <ProjectsListFilters
              triggerSearchProjects={() => undefined}
              title={'test'}
              statuses={['NEW']}
              archived={false}
              notArchived={true}
              startDate={'11-1-2021'}
              endDate={'12-1-2022'}
              accessType={'owner'}
            />
          }
        />
      </MockedProvider>
    );
    expect(view).toBeDefined();
  });

  test('Show access type and date filters', async () => {
    render(
      <MockedProvider>
        <Provider
          store={store}
          children={
            <ProjectsListFilters
              triggerSearchProjects={() => undefined}
              title={'test'}
              statuses={['NEW']}
              archived={false}
              notArchived={true}
              startDate={'11-1-2021'}
              endDate={'12-1-2022'}
              accessType={'owner'}
            />
          }
        />
      </MockedProvider>
    );

    accessType.forEach((text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    date.forEach((text: string) => {
      expect(screen.getByPlaceholderText(text)).toBeInTheDocument();
    });
  });
});
