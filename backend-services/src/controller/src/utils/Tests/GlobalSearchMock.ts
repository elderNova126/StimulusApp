import { CompanyProvider } from 'src/company/company.provider';

const GlobalSearchMock = {
  indexes: {
    use: jest.fn().mockReturnThis(),
    buildQuery: jest.fn().mockReturnThis(),
    queryType: jest.fn().mockReturnThis(),
    searchMode: jest.fn().mockReturnThis(),
    search: jest.fn().mockReturnThis(),
    top: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    orderbyDesc: jest.fn().mockReturnThis(),
    orderbyAsc: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    executeQuery: jest.fn().mockReturnValue(Promise.resolve(CompanyProvider.buildSearchResponse())),
  },
};
export default GlobalSearchMock;
