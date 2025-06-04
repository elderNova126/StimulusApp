import { useMutation } from '@apollo/client';
import { Text } from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductMutations from '../../../graphql/Mutations/ProductMutations';
import { Product } from '../company.types';
import { EditCompanyRowAccordion, EditCompanyTextField } from '../shared';
const { UPDATE_PRODUCT_GQL, CREATE_PRODUCT_GQL } = ProductMutations;

const ProductFormItem = forwardRef((props: { product?: Product; hideTopBorder: boolean; companyId: string }, ref) => {
  const { product, hideTopBorder, companyId } = props;
  const { t } = useTranslation();
  const [name, setName] = useState(product?.name ?? '');
  const [type, setType] = useState(product?.type ?? '');
  const [description, setDescription] = useState(product?.description ?? '');

  const [updateProduct] = useMutation(UPDATE_PRODUCT_GQL);
  const [createProduct] = useMutation(CREATE_PRODUCT_GQL);

  const save = () => {
    if (product?.id) {
      const updates = {
        ...(!!name && name !== product.name && { name }),
        ...(!!type && type !== product.type && { type }),
        ...(!!description && description !== product.description && { description }),
      };

      if (Object.keys(updates).length) {
        return updateProduct({ variables: { ...updates, id: product.id } });
      }
    } else {
      return createProduct({ variables: { name, type, description, companyId } });
    }
  };

  useImperativeHandle(ref, () => ({
    save,
  }));

  return (
    <EditCompanyRowAccordion name={name ?? 'New Product'} {...(hideTopBorder && { borderTopWidth: '0' })}>
      <EditCompanyTextField
        type="text"
        label={t('Name')}
        locked={false}
        value={name}
        max={80}
        onChange={(val) => setName(val as string)}
      />
      {name.length >= 80 && (
        <Text fontWeight="300" fontSize="13px" color="red.500">
          Name can not exceed 80 characters
        </Text>
      )}
      <EditCompanyTextField
        type="text"
        label={t('Type')}
        locked={false}
        value={type}
        max={80}
        onChange={(val) => setType(val as string)}
      />
      {type.length >= 80 && (
        <Text fontWeight="300" fontSize="13px" color="red.500">
          Type can not exceed 80 characters
        </Text>
      )}
      <EditCompanyTextField
        type="textarea"
        label={t('Description')}
        locked={false}
        value={description}
        onChange={(val) => setDescription(val as string)}
      />
    </EditCompanyRowAccordion>
  );
});

export default ProductFormItem;
