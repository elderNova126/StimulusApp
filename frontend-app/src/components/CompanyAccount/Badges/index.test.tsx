import { fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../../stores/global';
import { LocationProvider, createHistory, createMemorySource } from '@reach/router';
import { Badge } from '../../CompanyAccount/Badges/badge.types';
import Badges from './Badges';
import BadgeTable from './BadgeTable';
import { capitalizeFirstLetter } from '../../../utils/dataMapper';
import BadgeForm from './BadgeForm';
import { useBadgeQuery, useDeleteBadge, useUpdateBadge, useCreateBadge } from './badgesHooks';

// Mock the FormCompanyProvider
jest.mock('../../../hooks/companyForms/companyForm.provider', () => ({
  FormCompanyProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('./badgesHooks', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  useBadgeQuery: jest.fn(),
  useDeleteBadge: jest.fn(),
  useUpdateBadge: jest.fn(),
  useCreateBadge: jest.fn(),
}));

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  const history = createHistory(createMemorySource(route));
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    history,
  };
};
describe('Badges component with LoadingScreen', () => {
  beforeEach(() => {
    (useBadgeQuery as jest.Mock).mockReturnValue({ loading: false, data: { badges: [] } });
    (useDeleteBadge as jest.Mock).mockReturnValue({ deleteBadge: jest.fn(), loadingDelete: false });
    (useUpdateBadge as jest.Mock).mockReturnValue({ updateBadge: jest.fn(), loadingUpdate: false });
    (useCreateBadge as jest.Mock).mockReturnValue({ createBadge: jest.fn(), loadingCreate: false });
  });

  test('Should display LoadingScreen when loading is true', async () => {
    (useBadgeQuery as jest.Mock).mockReturnValue({ loading: true, data: null });

    renderWithRouter(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <Badges />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('Should not display LoadingScreen when loading is false', async () => {
    (useBadgeQuery as jest.Mock).mockReturnValue({ loading: false, data: { badges: [] } });

    renderWithRouter(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <Badges />
        </MockedProvider>
      </Provider>
    );

    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });
});

describe('badges page', () => {
  const badge: Badge = {
    badgeDateLabel: 'abc',
    badgeDateStatus: 'required',
    badgeDescription: 'abc',
    badgeName: 'Badge',
    badgeTenantCompanyRelationships: [
      { id: '123', badgeDate: '2023-05-05', badgeId: '4123213', tenantCompanyRelationshipId: '222' },
    ],
    id: '123',
    tenant: { id: '213' },
  };

  const badgesOptions: Badge[] = [
    {
      badgeDateLabel: 'abc',
      badgeDateStatus: 'optional',
      badgeDescription: 'desc3',
      badgeName: 'Badge1',
      badgeTenantCompanyRelationships: [
        { id: '1', badgeDate: '2023-05-05', badgeId: '3', tenantCompanyRelationshipId: '222' },
      ],
      id: '3',
      tenant: { id: '213' },
    },
    {
      badgeDateLabel: 'abc',
      badgeDateStatus: 'NA',
      badgeDescription: 'desc2',
      badgeName: 'Badge2',
      badgeTenantCompanyRelationships: [
        { id: '2', badgeDate: '2023-05-05', badgeId: '2', tenantCompanyRelationshipId: '222' },
      ],
      id: '2',
      tenant: { id: '213' },
    },
    {
      badgeDateLabel: 'abc',
      badgeDateStatus: 'required',
      badgeDescription: 'desc1',
      badgeName: 'Badge3',
      badgeTenantCompanyRelationships: [
        { id: '3', badgeDate: '2023-05-05', badgeId: '1', tenantCompanyRelationshipId: '222' },
      ],
      id: '1',
      tenant: { id: '213' },
    },
  ];

  test('should render badges page', () => {
    const initialState = {
      form: false,
    };

    render(
      <Provider store={store}>
        <MockedProvider children={<Badges />} />
      </Provider>,
      { initialState } as any
    );

    expect(screen.getByTestId('badge-page')).toBeInTheDocument();
    expect(screen.getByText('Badges')).toBeInTheDocument();
  });

  test('should render table with badge values', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<BadgeTable badges={badgesOptions} setBadge={() => ''} />} />
      </Provider>
    );

    expect(screen.getByTestId('badge-table')).toBeInTheDocument();
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('DATE')).toBeInTheDocument();

    badgesOptions.forEach((badge: Badge) => {
      expect(screen.getByText(badge.badgeName)).toBeInTheDocument();
      expect(screen.getByText(capitalizeFirstLetter(badge.badgeDateStatus))).toBeInTheDocument();
      expect(screen.getByText(badge.badgeDescription)).toBeInTheDocument();
    });
  });

  test('should render badge form without values and test inputs', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<BadgeForm setForm={() => ''} setBadge={() => ''} />} />
      </Provider>
    );

    const inputName = screen.getByTestId('badge-name-input') as HTMLInputElement;
    const inputDescription = screen.getByTestId('badge-description-input') as HTMLInputElement;
    const selectStatus = screen.getByTestId('edit-switch-badgeDate') as HTMLInputElement;

    expect(inputName).toHaveValue('');
    fireEvent.change(inputName, { target: { value: 'new name' } });
    expect(inputName).toHaveValue('new name');

    expect(inputDescription).toHaveValue('');
    fireEvent.change(inputDescription, { target: { value: 'new desc' } });
    expect(inputDescription).toHaveValue('new desc');

    expect(selectStatus).not.toBeChecked();
    fireEvent.click(selectStatus);
    expect(selectStatus).toBeChecked();
  });

  test('should render badge form with inputs filled with badge data to edit', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<BadgeForm badge={badge} setForm={() => ''} setBadge={() => ''} />} />
      </Provider>
    );

    const inputName = screen.getByTestId('badge-name-input') as HTMLInputElement;
    const inputDescription = screen.getByTestId('badge-description-input') as HTMLInputElement;
    const selectStatus = screen.getByTestId('edit-switch-badgeDate') as HTMLInputElement;

    expect(inputName).toHaveValue('Badge');
    fireEvent.change(inputName, { target: { value: 'new name' } });
    expect(inputName).toHaveValue('new name');

    expect(inputDescription).toHaveValue('abc');
    fireEvent.change(inputDescription, { target: { value: 'new desc' } });
    expect(inputDescription).toHaveValue('new desc');

    expect(selectStatus).toBeInTheDocument(); // ✅ Ensures element exists
    expect(selectStatus).toBeChecked(); // ✅ Instead of `.checked.toBe(true)`

    fireEvent.click(selectStatus);
    expect(selectStatus).not.toBeChecked(); // ✅ Instead of `.checked.toBe(false)`

    fireEvent.click(selectStatus);
    expect(selectStatus).toBeChecked(); // ✅ Instead of `.checked.toBe(true)`
  });
});
