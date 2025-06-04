import { AccordionItem } from '@chakra-ui/react';
import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, Product } from '../company.types';
import { CompanyAccordion, CreateTableItemButton } from '../shared';
import ProductFormItem from './ProductFormItem';

const UpdateView = forwardRef((props: { company: Company }, ref) => {
  const { company } = props;
  const products = useMemo(() => company.products?.results ?? [], [company]);
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const { t } = useTranslation();
  const productsLength = products.length;
  const [newProductsCount, setNewProductsCount] = useState(0);
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(productsLength + newProductsCount)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [productsLength, newProductsCount]);

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const newLocationsComponents =
    newProductsCount > 0 &&
    Array(newProductsCount)
      .fill(null)
      .map((_, i) => (
        <ProductFormItem ref={elRefs[productsLength + i]} key={i} hideTopBorder={false} companyId={company.id} />
      ));
  return (
    <CompanyAccordion>
      {products.map((product: Product, i: number) => (
        <ProductFormItem
          ref={elRefs[i]}
          companyId={company.id}
          key={product.id}
          product={product}
          hideTopBorder={i === 0}
        />
      ))}
      {newLocationsComponents}
      <AccordionItem>
        <CreateTableItemButton onClick={() => setNewProductsCount(newProductsCount + 1)} label={t('New Product')} />
      </AccordionItem>
    </CompanyAccordion>
  );
});

export default UpdateView;
