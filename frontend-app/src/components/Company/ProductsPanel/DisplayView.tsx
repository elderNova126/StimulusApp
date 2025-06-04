import { Box, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../company.types';

import ProductItem from './ProductItem';

const DisplayView = (props: { products: Product[]; isListView: boolean }) => {
  const { products, isListView } = props;
  const { t } = useTranslation();

  const productRows = useMemo(() => {
    const productRows = [];
    if (!products.length) {
      return null;
    }
    for (let i = 0; i < products.length; i = i + 3) {
      productRows.push(
        <Flex key={`${products.length}_${i}`}>
          <Box flex="1">
            <ProductItem product={products[i]} />
          </Box>
          <Box flex="1">
            <ProductItem product={products[i + 1]} />
          </Box>
          <Box flex="1">
            <ProductItem product={products[i + 2]} />
          </Box>
        </Flex>
      );
    }
    return productRows;
  }, [products]);

  if (!products.length) {
    return <Text textStyle="body">{t('No Products found.')}</Text>;
  }

  return isListView ? (
    <Box maxH="200px" overflowY="scroll">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th borderColor="#D5D5D5">
              <Text textStyle="h5">{t('TITLE')}</Text>
            </Th>
            <Th borderColor="#D5D5D5">
              <Text textStyle="h5">{t('TYPE')}</Text>
            </Th>
            <Th borderColor="#D5D5D5">
              <Text textStyle="h5">{t('DESCRIPTION')}</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td borderColor="#D5D5D5">
                <Text as="h4" textStyle="h4">
                  {product.name}
                </Text>
              </Td>
              <Td borderColor="#D5D5D5">
                <Text textStyle="tableSubInfoSecondary">{product.type}</Text>
              </Td>
              <Td borderColor="#D5D5D5">
                <Text textStyle="tableSubInfoSecondary">{product.description}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  ) : (
    <Stack spacing={2} maxH="300px" overflowY="scroll">
      {productRows}
    </Stack>
  );
};

export default DisplayView;
