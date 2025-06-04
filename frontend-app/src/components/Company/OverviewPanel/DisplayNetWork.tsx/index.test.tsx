import { render, screen } from '@testing-library/react';
import { CompanyNetWorks } from './DisplayNetWorks';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<CompanyNetWorks />', () => {
  it('should render the component', () => {
    expect(() =>
      render(<CompanyNetWorks company={{ facebook: '', linkedin: '', twitter: '', website: '' }} />)
    ).not.toThrow();
  });

  it('should render the component with facebook', () => {
    render(<CompanyNetWorks company={{ facebook: 'facebook', linkedin: '', twitter: '', website: '' }} />);
    const element = screen.getByTestId('facebook');
    expect(element).toBeInTheDocument();
  });

  it('should render the component with linkedin', () => {
    render(<CompanyNetWorks company={{ facebook: '', linkedin: 'linkedin', twitter: '', website: '' }} />);
    const element = screen.getByTestId('linkedin');
    expect(element).toBeInTheDocument();
  });

  it('should render the component with twitter', () => {
    render(<CompanyNetWorks company={{ facebook: '', linkedin: '', twitter: 'twitter', website: '' }} />);
    const element = screen.getByTestId('twitter');
    expect(element).toBeInTheDocument();
  });

  it('should render the component with website', () => {
    render(<CompanyNetWorks company={{ facebook: '', linkedin: '', twitter: '', website: 'website' }} />);
    const element = screen.getByTestId('website');
    expect(element).toBeInTheDocument();
  });
});
