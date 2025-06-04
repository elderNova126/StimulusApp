import { render, screen } from '@testing-library/react';
import { CompanyBusinessNames } from './DisplayBusinessNames';
import { nameTypes } from '../../company.types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<CompanyBusinessNames />', () => {
  const company = {
    legalBusinessName: '',
    doingBusinessAs: '',
    names: [],
  };

  it('should render the component', () => {
    render(<CompanyBusinessNames company={company} />);
    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toHaveTextContent('Business Name(s)');
  });

  it('should render the component with legalBusinessName', () => {
    render(<CompanyBusinessNames company={{ ...company, legalBusinessName: 'legalBusinessName' }} />);
    const legalName = screen.getByTestId('Business-Name-LEGAL');
    expect(legalName).toHaveTextContent('LEGAL');
  });

  it('should render the component with All names', () => {
    render(
      <CompanyBusinessNames
        company={{
          legalBusinessName: 'legalBusinessName',
          doingBusinessAs: 'doingBusinessAs',
          names: [
            {
              id: 1,
              type: nameTypes.OTHER,
              name: nameTypes.OTHER,
            },
            {
              id: 1,
              type: nameTypes.PREVIOUS,
              name: nameTypes.PREVIOUS,
            },
          ],
        }}
      />
    );

    const legalName = screen.getByTestId('Business-Name-LEGAL');
    const dbaName = screen.getByTestId('Business-Name-DBA');
    const previousName = screen.getByTestId('Business-Name-PREVIOUS');
    const otherName = screen.getByTestId('Business-Name-OTHER');

    expect(legalName).toHaveTextContent('LEGAL');
    expect(dbaName).toHaveTextContent('DOING BUSINESS AS');
    expect(previousName).toHaveTextContent('PREVIOUS');
    expect(otherName).toHaveTextContent('OTHER');
  });
});
