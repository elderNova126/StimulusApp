import EditDescription from './EditDescription';
import { CompanyAccordion } from '../shared';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DisplayView from './DisplayView';
import UpdatePanel from './UpdatePanel';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../../stores/global';
import { FormCompanyProvider } from '../../../hooks/companyForms/companyForm.provider';
import { LegalEntityType, OperatingStatus } from '../../../utils/constants';
import { setParentCompanyTaxId } from '../../../stores/features/company';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('overview component', () => {
  const company = {
    id: '3123123213',
    customers: 3,
    projectsOverview: {
      globalSpent: 1,
      totalProjects: 1,
      accountProjects: 1,
      accountSpent: 1,
      accountEvaluations: 1,
      totalEvaluations: 1,
    },
    tenantCompanyRelation: {
      type: 'internal',
      status: 'inactive',
    },
    operatingStatus: 'Open',
    parentCompany: { taxIdNo: 'US:01-000000' },
    parentCompanyTaxId: 'US:01-0000000',
  };

  test('Should show values of overview highlights first rows', async () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <DisplayView highlight={true} otherFields={false} company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );
    expect(screen.getByTestId('customer-display')).toBeInTheDocument();
    expect(screen.getByTestId('total-projects-display')).toBeInTheDocument();
    expect(screen.getByTestId('global-spent-display')).toBeInTheDocument();
    expect(screen.getByTestId('evaluations-display')).toBeInTheDocument();
  });

  test('Dont display overview highlights first row', async () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <DisplayView highlight={false} otherFields={false} company={[] as any} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );
    expect(screen.queryByTestId('customer-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('total-projects-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('global-spent-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('evaluations-display')).not.toBeInTheDocument();
  });

  test('Should show values in update mode', async () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <UpdatePanel company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );
    expect(screen.getByTestId('customer-update')).toBeInTheDocument();
    expect(screen.getByTestId('total-projects-update')).toBeInTheDocument();
    expect(screen.getByTestId('global-spent-update')).toBeInTheDocument();
    expect(screen.getByTestId('evaluations-update')).toBeInTheDocument();
  });

  test('Show text when popoverTrigger is true', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <UpdatePanel company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );

    expect(screen.getByText('Tax Identification Number Locked')).toBeInTheDocument();
  });

  test('Should display tax id input', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <UpdatePanel company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );

    expect(screen.getByTestId('tax-id-no')).toBeInTheDocument();
  });

  test('Check description', async () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <CompanyAccordion>
              <EditDescription description="abc" />
            </CompanyAccordion>
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );

    const input = screen.getByTestId('Edit-Description') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('abc');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('abc');
  });

  it('Renders dropdown operating status with all options', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <UpdatePanel company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );

    const operatingStatusButton = screen.getByRole('button', { name: 'Operating Status' });
    fireEvent.click(operatingStatusButton); // Click to expand

    // Wait for the select field to appear
    const selectElement = screen.getByLabelText('Operating Status');
    expect(selectElement).toBeInTheDocument();

    // Get all options inside the select element
    const optionElements = screen.getAllByRole('option');
    expect(optionElements.length).toBe(OperatingStatus.length);
  });

  it('Renders dropdown legal entity type', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <UpdatePanel company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );
    const operatingStatusButton = screen.getByRole('button', { name: 'Legal Entity Type' });
    fireEvent.click(operatingStatusButton); // Click to expand
    const selectElement = screen.getByLabelText('Legal Entity Type') as HTMLSelectElement;
    expect(selectElement).toBeInTheDocument();
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(LegalEntityType.length);
  });

  it('Test parent tax id no', async () => {
    store.dispatch(setParentCompanyTaxId(company.parentCompanyTaxId));

    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider>
            <UpdatePanel company={company} />
          </MockedProvider>
        </FormCompanyProvider>
      </Provider>
    );

    await screen.findByText('Parent Company Tax ID');
    await screen.findByPlaceholderText('Tax ID');
    await waitFor(() => {
      expect(screen.getByTestId('parent-taxIdNo-input')).toBeInTheDocument();
    });
    const input = screen.getByTestId('parent-taxIdNo-input') as HTMLInputElement;
    expect(input).toHaveValue(company.parentCompanyTaxId);
  });
});
