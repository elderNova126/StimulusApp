import Icon from '@chakra-ui/icon';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company, Product } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import ProductFilters from './ProductFilters';
import UpdateView from './UpdateView';
import StimButton from '../../ReusableComponents/Button';

const ProductsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const { t } = useTranslation();
  const [isListView, setIsListView] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const products = useMemo(() => company.products?.results || [], [company]);
  const [count, setcount] = useState(0);
  const filteredProducts = useMemo(
    () => products.filter((product: Product) => selectedTypes.length === 0 || selectedTypes.includes(product.type)),
    [products, selectedTypes]
  );
  const availableTypes = useMemo(
    () => Array.from(new Set((products || []).map((product: Product) => product.type))),
    [products]
  );
  useEffect(() => {
    if (company.products?.results) {
      setcount(company.products?.results.length);
    }
  }, [company]);

  return (
    <Stack spacing={edit ? 0 : 5} id="products">
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="1.5">
              {t('Products')}
            </Text>
            <CustomTooltip label={'Product/Service provided by the company.'}>
              <Box lineHeight="2rem">
                <InfoOutlineIcon color="gray" />
              </Box>
            </CustomTooltip>
            {count > 0 && (
              <Flex sx={styleNumberOfResults} marginTop="-1.5%">
                <Text sx={styleNumber}>{count}</Text>
              </Flex>
            )}
          </Flex>
          {!edit && (
            <Flex flexDirection="row" position="absolute" right="3rem">
              <ProductFilters
                isOpen={isFiltersOpen}
                setIsOpen={setIsFiltersOpen}
                filterHook={[selectedTypes, setSelectedTypes]}
                availableTypes={availableTypes}
              />
              <StimButton
                onClick={() => setIsListView(true)}
                size="stimSmall"
                colorScheme="gradient.iconbutton"
                variant={isListView ? 'stimPrimary' : 'stimTextButton'}
              >
                {t('List View')}
                {isListView && (
                  <Icon
                    fontSize="12px"
                    margin="7px 0 7px 7px"
                    as={IoMdClose}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsListView(false);
                    }}
                  />
                )}
              </StimButton>
            </Flex>
          )}
        </Stack>
        <CompanyProfileDivider />
      </Stack>
      {edit ? (
        <UpdateView ref={ref} company={company} />
      ) : (
        <DisplayView isListView={isListView} products={filteredProducts} />
      )}
    </Stack>
  );
});

export default ProductsPanel;
