require('dotenv').config();

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  globals: {
    crypto: true,
  },
  rootDir: './',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!react-markdown/)',
    'node_modules/(?!vfile/)',
    'node_modules/(?!@types/)',
    'node_modules/(?!jest-runtime/)',
    '/node_modules/(?!axios)',
    'node_modules/(?!module-to-transform|other-module)/',
    'node_modules',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^axios$': 'axios/dist/node/axios.cjs',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node', 'mjs'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/frontend-app/src/stores', // Adjust the path to the store file you want to omit
  ],
};
