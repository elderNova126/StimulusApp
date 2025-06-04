import { render, screen } from '@testing-library/react';
import { CompananyOwnership } from './DisplayOwners';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<CompananyOwnership />', () => {
  it('should render the component', () => {
    render(<CompananyOwnership employeesDiverse={null} companyOwners={[]} ownershipDescription={''} />);
    const element = screen.getByTestId('companany-ownership');
    expect(element).toBeInTheDocument();
  });

  it('should render the component with employeesDiverse', () => {
    const employeesDiverse = 10;
    render(<CompananyOwnership employeesDiverse={employeesDiverse} companyOwners={[]} ownershipDescription={''} />);
    const element = screen.getByTestId(`ownership-employees-diverse-${employeesDiverse}`);
    expect(element).toBeInTheDocument();
  });

  it('should render the component with companyOwners', () => {
    const companyOwners = ['companyOwners'];
    render(<CompananyOwnership employeesDiverse={null} companyOwners={companyOwners} ownershipDescription={''} />);
    const element = screen.getByTestId(companyOwners[0]);
    expect(element).toBeInTheDocument();
  });

  it('should render the component with ownershipDescription', () => {
    const TestDescription = Math.random().toString(36).substring(2, 15);
    render(<CompananyOwnership employeesDiverse={null} companyOwners={[]} ownershipDescription={TestDescription} />);
    const element = screen.getByTestId('ownershipDescription');
    expect(element).toBeInTheDocument();
  });
});
