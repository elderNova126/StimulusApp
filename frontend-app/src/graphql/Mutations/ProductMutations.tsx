import { gql } from '@apollo/client';

const CREATE_PRODUCT_GQL = gql`
  mutation createProduct($companyId: String!, $name: String, $type: String, $description: String) {
    createProduct(companyId: $companyId, name: $name, type: $type, description: $description) {
      ... on Product {
        id
        name
        type
        description
      }
    }
  }
`;

const UPDATE_PRODUCT_GQL = gql`
  mutation updateProduct($id: String!, $name: String, $type: String, $description: String) {
    updateProduct(id: $id, name: $name, type: $type, description: $description) {
      ... on Product {
        id
        name
        type
        description
      }
    }
  }
`;

const ProductMutations = {
  CREATE_PRODUCT_GQL,
  UPDATE_PRODUCT_GQL,
};

export default ProductMutations;
