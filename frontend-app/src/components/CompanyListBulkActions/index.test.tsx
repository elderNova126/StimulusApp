import { render, screen } from '@testing-library/react';
import CompanyListBulkActions from './index';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { store } from '../../stores/global';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const bulkSelect = ['test', 'test no 2'];
const buttons = ['Favorites', 'Lists', 'Projects', 'Internal'];

describe('CompanyBulkActions component', () => {
  test('Should render CompanyListBulkActions component with buttons', () => {
    render(
      <Provider store={store}>
        <MockedProvider children={<CompanyListBulkActions bulkSelection={bulkSelect} setBulk={() => false} />} />
      </Provider>
    );

    buttons.forEach((text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
