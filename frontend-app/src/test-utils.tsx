import { ChakraProvider, theme } from '@chakra-ui/react';
import { render } from '@testing-library/react';

const AllProviders = (props: any) => (
  <ChakraProvider resetCSS theme={theme}>
    {props.children}
  </ChakraProvider>
);

const customRender = (ui: any, options?: any) => render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
