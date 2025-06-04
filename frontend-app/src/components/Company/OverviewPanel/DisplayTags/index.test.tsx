/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { CompanyTags } from './DisplayTags';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<CompanyTags />', () => {
  it('should render the component', () => {
    render(<CompanyTags tags={[]} />);
    const heading = screen.getByRole('heading', { name: 'Tags' });
    expect(heading).toBeInTheDocument();
  });

  it('should render the component with tags', () => {
    const tags = [{ tag: 'tags' }];
    render(<CompanyTags tags={tags} />);
    const tagElement = screen.getByText(tags[0].tag);
    expect(tagElement).toBeInTheDocument();
  });
});
