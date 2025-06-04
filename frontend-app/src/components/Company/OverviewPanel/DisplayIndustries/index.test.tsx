import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { CompanyIndustries } from './DisplayIndustries';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('<CompanyIndustries />', () => {
  it('should render the component', () => {
    renderWithChakra(<CompanyIndustries industries={[]} />);
    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toHaveTextContent('Industry');
  });

  it('should render the component with industries', () => {
    renderWithChakra(<CompanyIndustries industries={[{ id: 'id', title: 'title', code: 'code' }]} />);
    const industry = screen.getByText('title');
    expect(industry).toBeInTheDocument();
  });

  it('should render the component with multiple industries', () => {
    renderWithChakra(
      <CompanyIndustries
        industries={[
          { id: 'id', title: 'title', code: 'code' },
          { id: 'id2', title: 'title2', code: 'code2' },
        ]}
      />
    );
    const industry1 = screen.getByText('title');
    const industry2 = screen.getByText('title2');
    expect(industry1).toBeInTheDocument();
    expect(industry2).toBeInTheDocument();
  });
});
