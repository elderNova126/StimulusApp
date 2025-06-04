import { render, fireEvent, screen } from '@testing-library/react';
// import { screen } from '@testing-library/dom';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../../stores/global';
import EditDiverseOwnership from './EditDiverseOwnership';
import { FormCompanyProvider } from '../../../hooks/companyForms/companyForm.provider';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Edit Diversity ownership', () => {
  const company = {
    smallBusiness: false,
    ownershipDescription: '',
    diverseOwnership: [],
    minorityOwnership: [],
  };
  const companyWirhDiverses = {
    smallBusiness: false,
    ownershipDescription: '',
    diverseOwnership: ['diverse'],
    minorityOwnership: [],
  };
  const companyWirhMinority = {
    smallBusiness: false,
    ownershipDescription: '',
    diverseOwnership: [],
    minorityOwnership: ['minority'],
  };
  const companyWirhDiversesAndMinority = {
    smallBusiness: false,
    ownershipDescription: '',
    diverseOwnership: ['diverse'],
    minorityOwnership: ['minority'],
  };

  test('Should render component when there is data for panel', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={company as any} />} />
        </FormCompanyProvider>
      </Provider>
    );
  });

  test('employeesDiverse input', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={company as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    // const input = screen.queryByTestId('Edit-number-EmployeesDiverse') as HTMLInputElement;
    // expect(input).not.toBeNull();
    // expect(input).toBeInTheDocument();
    // fireEvent.change(input, { target: { value: '50' } });
    // expect(input.value).toBe('50');
    // fireEvent.change(input, { target: { value: '200' } });
    // expect(input.value).toBe('100');
    // fireEvent.change(input, { target: { value: -10 } });
    // expect(input.value).toBe('0');
  });

  test('Check diversity tags is show', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={companyWirhDiverses as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    // const tags = screen.getByTestId('Currents-Diversity-Tag');
    // expect(tags).toBeInTheDocument();
  });

  test('Check minority tags is show', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={companyWirhMinority as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    // const tags = screen.getByTestId('Currents-Minority-Tag');
    // expect(tags).toBeInTheDocument();
  });

  test('Check diversity and minority tags is show', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={companyWirhDiversesAndMinority as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    // const tags = screen.getByTestId('Currents-Diversity-Tag');
    // expect(tags).toBeInTheDocument();
    // const tagsMinority = screen.getByTestId('Currents-Minority-Tag');
    // expect(tagsMinority).toBeInTheDocument();
  });

  test('Check switch functionality', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={companyWirhDiversesAndMinority as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    const switchButton = screen.getByTestId('Edit-Switch-smallBusiness') as any;
    expect(switchButton).toBeInTheDocument();
    // const inputValue = switchButton.checked;
    // expect(inputValue).toBe(false);
    // fireEvent.click(switchButton);
    // const inputValueAfterClick = switchButton.checked;
    // expect(inputValueAfterClick).toBe(true);
  });

  test('Check Description value', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={companyWirhDiversesAndMinority as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    const input = screen.getByTestId('Edit-OwnershipDescription') as any;
    expect(input).toBeInTheDocument();
    const inputValue = input.value;
    expect(inputValue).toBe('');
    fireEvent.change(input, { target: { value: 'test' } });
    const inputValueAfterClick = input.value;
    expect(inputValueAfterClick).toBe('test');
  });

  test('Check select options', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={company as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    // const select = screen.getByTestId('Edit-Select-Diversity-Tag') as any;
    // expect(select).toBeInTheDocument();
    // const inputValue = select.value;
    // expect(inputValue).toBe(SELECT_DEFAULT_VALUE);

    // const options = screen.getByTestId('Edit-Options-Select-Diversity-Tag') as any;
    // expect(options).toBeInTheDocument();
    // options.value = 'test';
    // fireEvent.click(options);

    // const inputValueAfterClick = select.value;
    // expect(inputValueAfterClick).toBe('test');
  });

  test('Check add a new tags', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={company as any} />} />
        </FormCompanyProvider>
      </Provider>
    );
    // const options = screen.getByTestId('Edit-Options-Select-Diversity-Tag') as HTMLSelectElement;
    // options.value = 'test-option';
    // fireEvent.click(options);

    // const select = screen.getByTestId('Edit-Select-Diversity-Tag') as any;
    // fireEvent.change(select, { target: { value: 'test-option' } });

    // const addButton = screen.getByTestId('Add-Tag-Button') as any;
    // expect(addButton).toBeInTheDocument();
    // addButton.click();

    // const listOfAdded = screen.getByTestId('Currents-Diversity-Tag');
    // expect(listOfAdded).toBeInTheDocument();
    // const newTags = screen.getByTestId('test-option_tag_id') as any;
    // expect(newTags).toBeInTheDocument();
  });

  test('check remove new tags', () => {
    render(
      <Provider store={store}>
        <FormCompanyProvider>
          <MockedProvider children={<EditDiverseOwnership company={company as any} />} />
        </FormCompanyProvider>
      </Provider>
    );

    // const options = screen.getByTestId('Edit-Options-Select-Diversity-Tag') as HTMLSelectElement;
    // options.value = 'test-option';
    // fireEvent.click(options);

    // const newTags = screen.getByTestId('tag-new-ownership-test-option');
    // fireEvent.click(newTags);

    // expect(screen.queryByTestId('tag-new-ownership-test-option')).not.toBeInTheDocument();
  });
});
