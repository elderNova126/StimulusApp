import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LeftMenu from '.';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
const { CREATE_COMPANY_LIST } = ListsMutations;
const { GET_COMPANY_LISTS } = CompanyQueries;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mocks = [
  {
    request: {
      query: CREATE_COMPANY_LIST,
      variables: { name: 'New List' },
    },
    result: {
      data: {
        createCompanyList: {
          id: '3',
          name: 'New List',
          companyIds: [],
        },
      },
    },
  },
  {
    request: {
      query: GET_COMPANY_LISTS,
    },
    result: {
      data: {
        companyLists: {
          results: [
            { id: '1', name: 'List 1', companyIds: ['1', '2'] },
            { id: '2', name: 'List 2', companyIds: ['3'] },
          ],
        },
      },
    },
  },
];

describe('Small Menu Component', () => {
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MockedProvider>
          <LeftMenu />
        </MockedProvider>
      </Provider>
    );

  const images = ['stimulus_logo'];

  images.forEach((image: string) => {
    test('Should load ' + image, async () => {
      renderComponent();
      const imageElements = screen.getAllByAltText(image);
      expect(imageElements.length).toBeGreaterThan(0);
      imageElements.forEach((img) => {
        expect(img).toBeDefined();
      });
    });
  });

  test('navigates to dashboard when logo icon button is clicked', () => {
    renderComponent();
    const dashboardButtons = screen.getAllByAltText('stimulus_logo');
    expect(dashboardButtons.length).toBeGreaterThan(0);
    const dashboardButton = dashboardButtons[0]; // Select the first one or the specific one you need
    expect(dashboardButton).toBeInTheDocument();

    fireEvent.click(dashboardButton);
    expect(window.location.pathname).toBe('/dashboard');
  });

  test('navigates to dashboard and sets menu open when dashboard button is clicked', () => {
    renderComponent();
    const dashboardButton = screen.getByTestId('small-menu-dashboard');
    expect(dashboardButton).toBeInTheDocument();

    fireEvent.click(dashboardButton);
    expect(window.location.pathname).toBe('/dashboard');
  });

  test('navigates to companies and sets menu open when companies button is clicked', () => {
    renderComponent();
    const companiesButton = screen.getByTestId('small-menu-companies');
    expect(companiesButton).toBeInTheDocument();

    fireEvent.click(companiesButton);
    expect(window.location.pathname).toBe('/companies/all/list/1');
  });

  test('navigates to projects and sets menu open when projects button is clicked', () => {
    renderComponent();
    const projectsButton = screen.getByTestId('small-menu-projects');
    expect(projectsButton).toBeInTheDocument();

    fireEvent.click(projectsButton);
    expect(window.location.pathname).toBe('/projects/1');
  });

  test('navigates to reports and sets menu open when reports button is clicked', () => {
    renderComponent();
    const reportsButton = screen.getByTestId('small-menu-reports');
    expect(reportsButton).toBeInTheDocument();

    fireEvent.click(reportsButton);
    expect(window.location.pathname).toBe('/pbreport');
  });
});

describe('LeftMenu Component', () => {
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks}>
          <LeftMenu />
        </MockedProvider>
      </Provider>
    );

  test('renders Companies link', () => {
    renderComponent();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('renders SplitterView component', () => {
    renderComponent();
    const splitterViewElement = screen.getByTestId('splitter-view');
    expect(splitterViewElement).toBeInTheDocument();
  });

  test('renders NewListModalContent component', async () => {
    renderComponent();
    const myListsMenuItem = screen.getAllByText('My Lists');
    fireEvent.click(myListsMenuItem[0]);

    await waitFor(() => {
      expect(screen.getByTestId('my-list')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('New List'));
    await waitFor(() => {
      const createButton = screen.getByText('Add');
      expect(createButton).toBeInTheDocument();
    });
  });

  test('close NewListModalContent component', async () => {
    renderComponent();
    const myListsMenuItem = screen.getAllByText('My Lists');
    fireEvent.click(myListsMenuItem[0]);

    await waitFor(() => {
      expect(screen.getByTestId('my-list')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('New List'));
    await waitFor(() => {
      const closeButton = screen.getByText('Cancel');
      expect(closeButton).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  test('renders Projects link', () => {
    renderComponent();
    const projectsButton = screen.getByText('All Projects');
    expect(projectsButton).toBeInTheDocument();

    fireEvent.click(projectsButton);

    expect(window.location.pathname).toBe('/projects/1');
  });

  test('renders companies list', () => {
    renderComponent();
    const logo = screen.getByAltText('STIMULUS');

    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);
    expect(window.location.pathname).toBe('/companies/all/list/1');
  });

  test('renders Internal list', () => {
    renderComponent();
    const menuItem = screen.getByText('Internal');
    expect(menuItem).toBeInTheDocument();

    fireEvent.click(menuItem);
    expect(window.location.pathname).toBe('/companies/internal/list/1');
  });

  test('renders Favorites list', () => {
    renderComponent();
    const menuItem = screen.getByText('Favorites');
    expect(menuItem).toBeInTheDocument();

    fireEvent.click(menuItem);
    expect(window.location.pathname).toBe('/companies/favorites/list/1');
  });

  test('renders Dashboard link', () => {
    renderComponent();
    const dashboardButton = screen.getByText('Home');
    expect(dashboardButton).toBeInTheDocument();

    fireEvent.click(dashboardButton);

    expect(window.location.pathname).toBe('/dashboard');
  });

  test('renders Followed link', () => {
    renderComponent();
    expect(screen.getByText('Followed')).toBeInTheDocument();
  });

  test('renders My Lists link', () => {
    renderComponent();
    expect(screen.getByText('My Lists')).toBeInTheDocument();
  });

  test('renders Favorites link', () => {
    renderComponent();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  test('renders All link', () => {
    renderComponent();
    const allButton = screen.getByText('All');
    expect(allButton).toBeInTheDocument();

    fireEvent.click(allButton);

    expect(window.location.pathname).toBe('/companies/all/list/1');
  });

  test('toggles showMyList', async () => {
    renderComponent();
    const myListsMenuItem = screen.getAllByText('My Lists');
    fireEvent.click(myListsMenuItem[0]);

    await waitFor(() => {
      expect(screen.getByTestId('my-list')).toBeInTheDocument();
    });

    const listItem1 = await screen.findByText('List 1');
    expect(listItem1).toBeInTheDocument();

    fireEvent.click(listItem1);
    expect(window.location.pathname).toBe('/companies/lists/1/list/1');
  });

  test('renders and interacts with NewListModalContent', async () => {
    renderComponent();
    const myListsMenuItem = screen.getAllByText('My Lists');
    fireEvent.click(myListsMenuItem[0]);

    const myList = await screen.findByTestId('my-list');
    expect(myList).toBeInTheDocument();

    const newListButton = screen.getByText('New List');
    fireEvent.click(newListButton);

    const createButton = await screen.findByText('Add');
    expect(createButton).toBeInTheDocument();
  });

  test('closes NewListModalContent', async () => {
    renderComponent();
    const myListsMenuItem = screen.getAllByText('My Lists');
    fireEvent.click(myListsMenuItem[0]);

    const myList = await screen.findByTestId('my-list');
    expect(myList).toBeInTheDocument();

    const newListButton = screen.getByText('New List');
    fireEvent.click(newListButton);

    const closeButton = await screen.findByText('Cancel');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });
});
