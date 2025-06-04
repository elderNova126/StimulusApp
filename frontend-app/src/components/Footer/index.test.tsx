import { render, screen } from '@testing-library/react';
import Footer from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Footer component', () => {
  test('Should contains copyright', async () => {
    render(<Footer />);
    const copyrightText = screen.getByText('Copyright © 2023. All Rights Reserved');
    expect(copyrightText).toBeInTheDocument();
  });
});
