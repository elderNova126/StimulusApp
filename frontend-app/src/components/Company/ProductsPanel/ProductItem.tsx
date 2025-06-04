import { Stack, Text } from '@chakra-ui/react';
import { ContentTrimmer } from '../../GenericComponents';
import { Product } from '../company.types';

const ProductItem = (props: { product: Product }) => {
  const { product } = props;

  return (
    <Stack spacing={2} w="350px">
      <Text as="h4" textStyle="h4">
        {product?.name}
      </Text>
      <Text textStyle="pagination">{product?.type}</Text>
      <Text textStyle="body" w="350px">
        <ContentTrimmer fontSize="14px" body={product?.description ?? '-'} />
      </Text>
    </Stack>
  );
};

export default ProductItem;
